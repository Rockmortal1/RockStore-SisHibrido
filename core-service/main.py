from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
import models
import schemas
from database import engine, SessionLocal
from auth import get_current_user
from datetime import datetime, timedelta

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="RockStore Core API", version="1.0")

def get_db():
    db= SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Microservicio Core en Phyton funca re bien y la base de datos 10/10"}

@app.get("/api/products", response_model=list[schemas.ProductResponse])
def get_all_products(db: Session = Depends(get_db)):
    return db.query(models.Product).all()

@app.get("/api/products/offers", response_model=list[schemas.ProductResponse])
def get_offers(db: Session = Depends(get_db)):
    return db.query(models.Product).filter(models.Product.discount_percentage>0).all()

@app.get("/api/products/{product_id}", response_model=schemas.ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()

    if product is None:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    return product

@app.get("/api/perfil")
def obtener_perfil_seguro(user_id: str = Depends(get_current_user)):
    """
    Esta es la ruta protegida, lo que este aqui se ejecuta despues del
    get_current_user y si es invalido va a devolver error 401 y nunca
    se ejecutara el siguiente return
    """
    return {
        "message": "Acceso consecido al microservicio de Phyton",
        "user_id_desde_csharp": user_id
    }

@app.get("/api/profile/me", response_model=schemas.CustomerResponse)
def get_my_profile(user_id: str = Depends(get_current_user), db: Session = Depends(get_db)):
    customer = db.query(models.Customer).filter(models.Customer.user_id).first()

    if not customer:
        customer = models.Customer(user_id=user_id)
        db.add(customer)
        db.commit()
        db.refresh(customer)

    return customer

@app.put("/api/profile/me", response_model=schemas.CustomerResponse)
def update_my_profile(
    prodile_data: schemas.CustomerUpdate,
    user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    customer = db.query(models.Customer).filter(models.Customer.user_id == user_id).first()

    if not customer:
        raise HTTPException(status_code=404, detail="Perfil no encontrado")

    customer.phone_number = prodile_data.phone_number
    db.commit()
    db.refresh(customer)

    return customer

@app.post("/api/checkout", response_model=schemas.OrderResponse)
def process_checkout(
    checkout_data: schemas.CheckoutRequest,
    user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    customer = db.query(models.Customer).filter(models.Customer.user_id == user_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Clietne no encontrado, Por favor inicie su perfil primero")

    total_amount = 0.0
    order_items_to_save = []

    for item in checkout_data.items:
        product = db.query(models.Product).filter(models.Product.id == item.product_id).first()

        if not product:
            raise HTTPException(status_code=404, detail=f"El producto con ID {item.product_id} no existe.")

        if product.stock < item.quantity:
            raise HTTPException(status_code=404, detail=f"Stock insuficiente para el producto con ID {item.product_id}.")

        discount_multiplier = 1 - (product.discount_percentage/100)
        final_unit_price = product.price * discount_multiplier

        total_amount += final_unit_price * item.quantity

        order_items_to_save.append({
            "product": product,
            "quantity": item.quantity,
            "unit_price": final_unit_price
        })

    cashback_used = 0.0
    if checkout_data.use_cashback and customer.cashback_points > 0:
        if customer.cashback_points >= total_amount:
            cashback_used = total_amount
            customer.cashback_points -= int(total_amount)
            total_amount = 0.0
        else:
            cashback_used = float(customer.cashback_points)
            total_amount -= cashback_used
            customer.cashback_points = 0

    new_order = models.Order(
        customer_id=customer.id,
        total_amount=total_amount,
        cashback_used=cashback_used,
        status="Pendiente"
    )
    db.add(new_order)
    db.flush()

    for oi in order_items_to_save:
        new_item = models.OrderItem(
            order_id=new_order.id,
            product_id=oi["product"].id,
            quantity=oi["quantity"],
            unit_price=oi["unit_price"]
        )
        db.add(new_item)

        oi["product"].stock -= oi["quantity"] #Descontamos el stock real

    db.commit()
    db.refresh(new_order)

    return new_order

@app.post("/api/products", response_model=schemas.ProductResponse)
def create_product(
    product_data: schemas.ProtuctCreate,
    user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_product = models.Product(**product_data.dict())

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return new_product

@app.get("/api/orders/me", response_model=list[schemas.OrderHistoryResponse])
def get_my_orders(user_id: str = Depends(get_current_user), db: Session = Depends(get_db)):
    customer = db.query(models.Customer).filter(models.Customer.user_id == user_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Perfil no encontrado.")

    return db.query(models.Order).filter(models.Order.customer_id == customer.id).order_by(models.Order.order_date.desc())

@app.get("/api/orders/{order_id}/invoice")
def generate_invoice(order_id: int, user_id: str = Depends(get_current_user), db: Session = Depends(get_db)):
    customer = db.query(models.Customer).filter(models.Customer.user_id == user_id).first()
    order = db.query(models.Order).filter(models.Order.id == order_id, models.Order.id == order_id, models.Order.customer_id == customer.id).first()

    if not order:
        raise HTTPException(status_code=404, detail="Pedido no encontrado o no pertece a este usuario")

    #Una vez terminado todo el front aqui va la conexion con ReportLab para general el PDF
    #Por ahora se devuelve una simulacion en URL para el front
    return {"message": "Factura generada con exito", "download_url": f"https://tu-tienda.com/invoices/INV-{order.id}.pdf"}

@app.post("/api/orders/{order_id}/cancel")
def cancel_order(
    order_id: int,
    cancel_data: schemas.OrderCancelRequest,
    user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    customer = db.query(models.Customer).filter(models.Customer.user_id == user_id).first()
    order = db.query(models.Order).filter(models.Order.id == order_id, models.Order.customer_id == customer.id).first()

    if not order:
        raise HTTPException(status_code=404, detail="Pedido no encontrado.")

    if order.status != "Pendiente":
        raise HTTPException(status_code=400, detail="Solo se puede cancelar pedidos que esten pendientes")

    dias_transcurridos = (datetime.utcnow() - order.order_date).days
    if dias_transcurridos > 3:
        raise HTTPException(status_code=400, detail="El plazo de 3 dias para cancelar el pedido expiro.")

    order.status="Cancelado"
    order.returned_at = datetime.utcnow()
    order.return_reason = cancel_data.reason

    for item in order.items:
        product = db.query(models.Product).filter(models.Product.id == item.product_id).first()
        if product:
            product.stock += item.quantity

    db.commit()
    return {"message": "Pedido cancelado con exito, stock devuelto y motivo registrado al sistema."}