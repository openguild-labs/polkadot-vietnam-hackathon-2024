import { BaseButtonProps } from "@/components/ui/inputs/types";
import { LayoutProps } from "@/components/ActionLayout";
import { aptosClient } from "@/utils";

// Define the types for action with parameters
export interface ActionWithParameters {
  href: string;
  label: string;
  parameters: Array<{
    name: string;
    label: string;
    required: boolean;
  }>;
}

export interface ActionWithoutParameters {
  href: string;
  label: string;
  parameters?: undefined;
}

export type Action = ActionWithParameters | ActionWithoutParameters;

// Type guard to determine if action has parameters
export const isActionWithParameters = (
  action: Action
): action is ActionWithParameters => {
  return "parameters" in action && action.parameters !== undefined;
};

// Function to create a button object
export const createButton = (
  action: ActionWithParameters
): BaseButtonProps => ({
  text: action.label,
  onClick: () => handleActionClick(action),
});

// Function to handle action clicks
const handleActionClick = async (action: Action) => {
  try {
    let url = action.href;

    // If the action has parameters, prompt user for input
    if (isActionWithParameters(action)) {
      const params = action.parameters.reduce((acc: any, param) => {
        if (param.required) {
          const value = prompt(param.label);
          if (!value) {
            alert(`The ${param.label} is required.`);
            return;
          }
          acc[param.name] = encodeURIComponent(value);
        }
        return acc;
      }, {});

      // Replace placeholders in URL with user input
      Object.keys(params).forEach((key) => {
        url = url.replace(`{${key}}`, params[key]);
      });
    }

    // Perform fetch request
    const response = await fetch(url, {
      method: "POST", // Change to "GET" if needed
      headers: {
        "Content-Type": "application/json",
        // Add other headers if necessary
      },
      // If necessary, include body in request
      // body: JSON.stringify({ toAddress: "address" })
    });

    const result = await response.json();
    console.log(result);
    const { transaction, message } = result;
    console.log(transaction);

    // Use signAndSubmitTransaction to sign and submit the transaction
    // const pendingTransaction = await signAndSubmitTransaction(transaction);
    // await aptosClient(network).waitForTransaction({
    //   transactionHash: pendingTransaction.hash,
    // });
  } catch (error) {
    console.error("Error handling action click:", error);
  }
};

// Function to map API response to LayoutProps
export const mapApiResponseToLayoutProps = (
  apiResponse: any,
  baseUrl: string
): LayoutProps => {
  const actionsWithParameters = apiResponse.links.actions.filter(
    isActionWithParameters
  );

  const actionsWithoutParameters = apiResponse.links.actions.filter(
    (action: Action): action is ActionWithoutParameters =>
      !("parameters" in action) || action.parameters === undefined
  );

  return {
    stylePreset: "default",
    title: apiResponse.title,
    description: apiResponse.description.trim(),
    image: apiResponse.icon,
    type: "trusted",
    websiteUrl: baseUrl,
    websiteText: baseUrl,
    buttons: actionsWithoutParameters.map((action: any) => ({
      label: action.label,
      text: action.label,
      onClick: () => handleActionClick(action),
    })),
    inputs: actionsWithParameters.flatMap((action: any) =>
      action.parameters.map((param: any) => ({
        type: "text",
        name: param.name,
        placeholder: param.label,
        required: param.required,
        disabled: false,
        button: createButton(action),
      }))
    ),
  };
};
