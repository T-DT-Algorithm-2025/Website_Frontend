import { reactive, readonly } from 'vue'

// Define the structure for the alert state
interface AlertState {
  show: boolean
  message: string
  type: 'info' | 'success' | 'error'
}

// Create a reactive state for the alert
const alertState = reactive<AlertState>({
  show: false,
  message: '',
  type: 'info'
})

/**
 * A composable function to manage a global alert system.
 * @returns An object with the alert state and functions to show/hide the alert.
 */
export function useAlert() {
  /**
   * Shows the alert with a specific message and type.
   * @param message The message to display.
   * @param type The type of the alert ('info', 'success', 'error'). Defaults to 'info'.
   */
  const showAlert = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    alertState.message = message
    alertState.type = type
    alertState.show = true
  }

  /**
   * Hides the alert.
   */
  const hideAlert = () => {
    alertState.show = false
  }

  return {
    alertState: readonly(alertState), // Expose state as readonly to prevent direct mutation
    showAlert,
    hideAlert
  }
}
