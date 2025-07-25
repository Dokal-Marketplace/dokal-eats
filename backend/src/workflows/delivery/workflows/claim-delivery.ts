import {
  createWorkflow,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/workflows-sdk";
import { DeliveryDTO, DeliveryStatus } from "../../../modules/delivery/types/common";
import { setStepSuccessStep } from "../../util/steps";
import { deleteDeliveryDriversStep, updateDeliveryStep } from "../steps";
import { findDriverStepId } from "../steps/find-driver";

export type ClaimWorkflowInput = {
  driver_id: string;
  delivery_id: string;
};

export const claimDeliveryWorkflow = createWorkflow(
  "claim-delivery-workflow",
  function (input: WorkflowData<ClaimWorkflowInput>) {
    // Update the delivery with the provided data
    const claimedDelivery = updateDeliveryStep({
      data: {
        id: input.delivery_id,
        driver_id: input.driver_id,
        delivery_status: DeliveryStatus.PICKUP_CLAIMED,
      },
    }) as WorkflowData<any>;

    // Delete the delivery drivers as they are no longer needed
    deleteDeliveryDriversStep({ delivery_id: claimedDelivery.id });

    // Set the step success for the find driver step
    setStepSuccessStep({
      stepId: findDriverStepId,
      updatedDelivery: claimedDelivery
    });

    // Return the updated delivery
    return new WorkflowResponse(claimedDelivery);
  }
);