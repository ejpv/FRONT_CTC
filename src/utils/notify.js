import Vue from 'vue'

export function swalConfirm(title) {
  Vue.swal.fire({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    background: '#66BB6A',
    iconColor: 'white',
    timer: 4000,
    icon: 'success',
    title: title,
    didOpen: () => {
      Vue.swal.hideLoading()
    }
  })
}

export function swalError(title) {
  Vue.swal.fire({
    position: 'bottom',
    toast: true,
    icon: 'error',
    title: title,
    confirmButtonText: 'Cerrar',
    confirmButtonColor: '#D32F2F',
    background: '#D32F2F',
    iconColor: 'white',
    width: '400px',
    didOpen: () => {
      Vue.swal.hideLoading()
    }
  })
}

export function swalLoading(title) {
  Vue.swal.fire({
    title: title,
    icon: 'warning',
    iconColor: 'white',
    background: '#FFB300',
    width: '300px',
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false,
    didOpen: () => {
      Vue.swal.showLoading()
    }
  })
}
