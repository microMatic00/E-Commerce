import { NextRequest, NextResponse } from "next/server";
import { orderService } from "@/services/pocketbaseService";
import { ORDER_STATUS } from "@/config/pocketbase.config";

export async function POST(request: NextRequest) {
  try {
    // Obtener los datos de la solicitud
    const data = await request.json();

    // Validar que los campos requeridos estén presentes
    if (
      !data.customerName ||
      !data.customerEmail ||
      !data.items ||
      !data.totalAmount ||
      !data.shippingAddress
    ) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    // Preparar los datos para la orden
    const orderData = {
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone || "",
      items: data.items,
      totalAmount: data.totalAmount,
      status: data.status || ORDER_STATUS.PROCESSING, // Por defecto processing
      shippingAddress: data.shippingAddress,
      createdAt: new Date().toISOString(),
    };

    // Crear la orden en PocketBase
    const newOrder = await orderService.createOrder(orderData);

    // Devolver respuesta exitosa
    return NextResponse.json(
      {
        success: true,
        orderId: newOrder.id,
        message: "Orden creada con éxito",
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error al crear orden:", error);

    // Devolver error
    let message = "Ocurrió un error al procesar la orden";
    if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json(
      {
        error: "Error al crear la orden",
        message,
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Obtener parámetros de la URL para filtrado opcional
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    let orders;

    if (email) {
      // Si se proporciona un email, obtener pedidos de ese cliente
      orders = await orderService.getOrdersByCustomer(email);
    } else {
      // De lo contrario, obtener todos los pedidos
      orders = await orderService.getAllOrders();
    }

    return NextResponse.json({ orders: orders.items }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error al obtener órdenes:", error);

    let message = "Ocurrió un error al procesar la solicitud";
    if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json(
      {
        error: "Error al obtener órdenes",
        message,
      },
      { status: 500 }
    );
  }
}
