import {
  ModuleRegistrationName,
  TransactionHandlerType,
} from "@medusajs/utils";
import { StepResponse, createStep } from "@medusajs/workflows-sdk";
import { DeliveryDTO } from "../../../modules/delivery/types/common";
import { handleDeliveryWorkflowId } from "../../delivery/workflows/handle-delivery";

type SetStepFailedStepInput = {
  stepId?: string;
  updatedDelivery: DeliveryDTO;
};

export const setStepFailedStepId = "set-step-failed-step";
export const setStepFailedStep = createStep(
  setStepFailedStepId,
  async function (
    { stepId, updatedDelivery }: SetStepFailedStepInput,
    { container }
  ) {
    if (!stepId) {
      return;
    }

    const engineService = container.resolve(
      ModuleRegistrationName.WORKFLOW_ENGINE
    );

    await engineService.setStepFailure({
      idempotencyKey: {
        action: TransactionHandlerType.INVOKE,
        transactionId: updatedDelivery.transaction_id,
        stepId,
        workflowId: handleDeliveryWorkflowId,
      },
      stepResponse: new StepResponse(updatedDelivery, updatedDelivery.id),
      options: {
        container,
      },
    });
  }
);
