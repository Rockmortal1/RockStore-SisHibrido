from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), index=True)
    description = Column(Text)
    price = Column(Float)
    discount_percentage = Column(Integer, default=0)
    stock = Column(Integer, default=0)
    category = Column(String(150), index=True)
    image_url = Column(String)

class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(150), unique=True, index=True) #Clave de enlace con el JWT de C#
    phone_number = Column(String)
    total_purchased = Column(Float, default=0.0)
    cashback_points = Column(Integer, default=0)
    orders = relationship("Order", back_populates="customer")

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"))
    order_date = Column(DateTime, default=datetime.utcnow)
    total_amount = Column(Float)
    cashback_used = Column(Float, default=0.0)
    status = Column(String, default="Pendiente")
    receipt_url = Column(String, nullable=True)
    returned_at = Column(String, default=0.0)
    return_reason = Column(Text, nullable=True)

    customer = relationship("Customer", back_populates="orders")
    items = relationship("OrderItem", back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Integer)
    unit_price = Column(Float)

    order = relationship("Order", back_populates="items")
    product = relationship("Product")