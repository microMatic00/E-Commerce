import { NextRequest, NextResponse } from "next/server";
import { orderService } from "@/services/pocketbaseService";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    // Verificar que el ID existe
    if (!id) {
      return NextResponse.json(
        { error: "Se requiere un ID de orden" },
        { status: 400 }
      );
    }

    // Obtener la orden por ID
    const order = await orderService.getOrderById(id);

    // Devolver la orden
    return NextResponse.json({ order }, { status: 200 });
  } catch (error: unknown) {
    console.error(`Error al obtener orden con ID ${params.id}:`, error);

    // Verificar si el error es que la orden no existe
    if (
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      (error as { status?: number }).status === 404
    ) {
      return NextResponse.json(
        { error: "Orden no encontrada" },
        { status: 404 }
      );
    }

    // Otro tipo de error
    return NextResponse.json(
      {
        error: "Error al obtener la orden",
        message:
          typeof error === "object" && error !== null && "message" in error
            ? (error as { message?: string }).message
            : "Ocurrió un error al procesar la solicitud",
      },
      { status: 500 }
    );
  }
}

// Endpoint para actualizar el estado de una orden
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const data = await request.json();

    // Verificar que el estado está presente
    if (!data.status) {
      return NextResponse.json(
        { error: "Se requiere un estado para actualizar" },
        { status: 400 }
      );
    }

    // Actualizar el estado de la orden
    const updatedOrder = await orderService.updateOrderStatus(id, data.status);

    // Devolver la orden actualizada
    return NextResponse.json(
      {
        success: true,
        order: updatedOrder,
        message: "Estado de la orden actualizado con éxito",
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error(`Error al actualizar orden con ID ${params.id}:`, error);

    return NextResponse.json(
      {
        error: "Error al actualizar la orden",
        message:
          typeof error === "object" && error !== null && "message" in error
            ? (error as { message?: string }).message
            : "Ocurrió un error al procesar la solicitud",
      },
      { status: 500 }
    );
  }
}
