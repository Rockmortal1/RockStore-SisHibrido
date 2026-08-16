from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ProductBase(BaseModel):
    name: str
    description: str
    price: float
    discount_percentage: int
    stock: int
    category: str
    image_url: str

class ProductResponse(ProductBase):
    id: int

    class Config:
        from_attibutes = True

class CustomerUpdate(BaseModel):
    phone_number: str

class CustomerResponse(BaseModel):
    id: int
    user_id: str
    phone_number:Optional[str] = None
    total_purchased: float
    cashback_points: int

    class Config:
        from_attibutes=True

class CartItem(BaseModel):
    product_id: int
    quantity: int

class CheckoutRequest(BaseModel):
    items: List[CartItem]
    use_cashback: bool = False

class OrderResponse(BaseModel):
    id: int
    total_amount: float
    cashback_used: float
    status: str

    class Config:
        from_attribtes = True

class ProtuctCreate(ProductBase):
    pass

class OrderCancelRequest(BaseModel):
    reason: str

class OrderHistoryResponse(OrderResponse):
    order_date: datetime
    returned_at: Optional[datetime] = None
    return_reason: Optional[str] = None
    receipt_url: Optional[str] = None

    class Config:
        from_attributes = True