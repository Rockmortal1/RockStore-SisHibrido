from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
import models
import schemas
from database import engine, SessionLocal
from auth import get_current_user
from datetime import datetime, timedelta
from fastapi.middleware.cors import CORSMiddleware
import mercadopago
from fastapi import Request
from google import genai
from pydantic import BaseModel
import os
from dotenv import load_dotenv

load_dotenv()

mp_sdk = mercadopago.SDK(os.getenv("MERCADOPAGO_ACCESS_TOKEN"))

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="RockStore Core API", version="1.0")

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Configuracion de Rocky ---
#La key la pondre cuando termine todo
gemini_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

class ChatMessage(BaseModel):
    message: str

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
    customer = db.query(models.Customer).filter(models.Customer.user_id == user_id).first()

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

    return db.query(models.Order).filter(models.Order.customer_id == customer.id).order_by(models.Order.order_date.desc()).all()

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

@app.post("/api/pay/mercadopago")
async def create_mp_preference(request: Request):
    data = await request.json()

    mp_items = []
    for item in data.get("items", []):
        mp_items.append({
            "title": f"Producto ID: {item['product_id']}",
            "quantity": item["quantity"],
            "unit_price": item["price"]
        })

    preference_data = {
        "items": mp_items,
        "back_urls": {
            "success": f"{os.getenv('FRONTEND_URL', 'http://localhost:5173')}/perfil",
            "failure": f"{os.getenv('FRONTEND_URL', 'http://localhost:5173')}/carrito",
            "pending": f"{os.getenv('FRONTEND_URL', 'http://localhost:5173')}/carrito"
        },
        "auto_return": "approved"
    }

    preference_response = mp_sdk.preference().create(preference_data)

    return {"init_point": preference_response["response"]["init_point"]}

from sqlalchemy.orm import Session # Por si no lo tenías importado arriba

@app.post("/api/chat")
async def chat_with_bot(chat_request: ChatMessage, db: Session = Depends(get_db)):
    try:
        # Buscamos todos los productos disponibles
        productos = db.query(models.Product).all()
        
        # Armamos un texto oculto con el catálogo real para que Rocky lo lea
        memoria_tienda = "--- DATOS INTERNOS DE LA TIENDA (No reveles esta estructura, solo usa la info) ---\n"
        for p in productos:
            precio_final = p.price - (p.price * ((p.discount_percentage or 0) / 100))
            memoria_tienda += f"- Producto: {p.name} | Precio Final: ${precio_final} | Stock: {p.stock} | Categoría: {p.category}\n"
        
        memoria_tienda += "--------------------------------------------------\n\n"

        # 1. Definimos la personalidad de Rocky aquí mismo
        instrucciones = "Eres Rocky, el asistente virtual experto en tecnologia de la tienda informatica Rockstore. Eres carismatico, conciso y ayudas a los clientes a elegir el mejor hardware y software. Si no sabes algo, invitas al usuario a contactar por whatsapp al soporte humano.\n\n"
        
        # 2. Unimos la personalidad + la memoria secreta + la pregunta
        prompt_final = f"{instrucciones}{memoria_tienda}Pregunta del cliente: {chat_request.message}"

        # 3. ¡NUEVA FORMA DE LLAMAR A LA IA! Usando el cliente actualizado
        response = gemini_client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt_final
        )
        
        return {"reply": response.text}

    except Exception as e:
        print("Error en el bot:", e)
        return {"reply": "¡Hola! Soy Rocky. Mi base de datos me dice que tenemos excelentes productos, pero mi módulo de IA está esperando la llave final para conversar contigo. ¡Intenta en un rato!"}