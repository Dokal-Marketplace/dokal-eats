import { StepResponse, createStep } from "@medusajs/workflows-sdk";
import { DeliveryDTO } from "../../../modules/delivery/types/common";
import { DELIVERY_MODULE } from "../../../modules/delivery";

export const createDeliveryStepId = "create-delivery-step";
export const createDeliveryStep = createStep(
  createDeliveryStepId,
  async function ({}, { container }) {
    const service = container.resolve(DELIVERY_MODULE);

    const rawDelivery = await service.createDeliveries({});

    const delivery: DeliveryDTO = {
      ...rawDelivery,
      items: [], // or fetch from somewhere
      restaurant: {
        handle: "",
        is_open: false,
        id: "",
        name: "",
        phone: "",
        email: "",
        created_at: undefined,
        updated_at: undefined,
        address: ""
      } // or fetch from somewhere
    };

    return new StepResponse(delivery, {
      delivery_id: delivery.id,
    });
  },
  async function (
    {
      delivery_id,
    },
    { container }
  ) {
    const service = container.resolve(DELIVERY_MODULE);

    service.softDeleteDeliveries(delivery_id);
  }
);
