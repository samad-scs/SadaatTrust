import Swal, { SweetAlertOptions, SweetAlertResult } from 'sweetalert2'

/**
 * Custom SweetAlert2 wrapper with TailwindCSS classes
 * @param options SweetAlert2 options
 * @returns Promise<SweetAlertResult<any>>
 */
export const showAlert = (options: SweetAlertOptions = {}): Promise<SweetAlertResult<any>> => {
  return Swal.fire({
    // Default Tailwind-styled classes
    customClass: {
      popup: '!rounded-[15px] p-6 shadow-xl !bg-background-default',
      title: 'text-2xl font-bold text-gray-800 dark:text-white',
      htmlContainer: 'text-gray-600 dark:text-gray-300 text-base',
      confirmButton: 'bg-primary text-white px-4 py-2 rounded-md hover:bg-accent focus:ring-2 focus:ring-blue-400',
      cancelButton: 'bg-gray-300 text-black px-4 py-2 rounded-md ml-2 hover:bg-gray-400',
      icon: 'text-primary',
      input: 'border border-gray-300 rounded-md px-3 py-2 focus:ring-2'
    },
    buttonsStyling: false, // disable default button styles
    ...options // merge user-provided options last to allow overrides if needed
  })
}
