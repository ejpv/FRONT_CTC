import { PdfMakeWrapper, Cell, Txt, Table, Img, Ul, Item, Columns } from 'pdfmake-wrapper'
import pdfFonts from 'pdfmake/build/vfs_fonts'

PdfMakeWrapper.setFonts(pdfFonts)

export class Report {
  static primary = '#26A69A'
  static blue = '#44546A'
  static white = '#FFF'
  static gray = '#ACB9CA'

  //Abre el PDF
  static async openPDF(item) {
    await this.definition(item).then(res => {
      res.create().open()
    })
  }

  static async definition(item) {
    const pdf = new PdfMakeWrapper()

    //encabezado del informe
    pdf.add(
      new Table([
        [
          new Cell(await this.image('unachInforme.jpg', 100, 60)).end,

          new Cell(
            new Txt(
              'INFORME TÉCNICO \nEMPRENDIMIENTOS COMUNITARIOS \nCALIDAD Y OFERTA DE SERVICIOS TURÍSTICOS COMUNITARIOS DE LAS PARROQUIAS RURALES DEL CANTÓN RIOBAMBA'
            )
              .bold()
              .fontSize(12)
              .color(this.blue).end
          ).end
        ]
      ])
        .widths([40, 500])
        .layout({ paddingBottom: () => 5, paddingTop: () => 10 })
        .layout('noBorders')
        .alignment('center').end
    )

    pdf.add(this.enter())

    //Datos del Establecimiento
    pdf.add(
      new Table([
        [
          new Txt('Nombre Emprendimiento:').bold().color(this.white).end,
          new Txt(item.diagnostico[0].establecimiento.nombre).bold().end,
          new Txt('Administrador:').bold().color(this.white).end,
          new Txt(item.diagnostico[0].establecimiento.administrador).bold().end
        ],
        [
          new Txt('Comunidad u Organización:').bold().color(this.white).end,
          new Txt(item.diagnostico[0].establecimiento.comunidad).bold().end,
          new Txt('Teléfono(s):').bold().color(this.white).end,
          new Txt(
            await this.getTelefono(item.diagnostico[0].establecimiento.telefono)
          ).bold().end
        ],
        [
          new Txt('Nacionalidad / Pueblo:').bold().color(this.white).end,
          new Txt(item.diagnostico[0].establecimiento.nacionalidad).bold().end,
          new Txt('Página web:').bold().color(this.white).end,
          new Txt(item.diagnostico[0].establecimiento.web).bold().end
        ],
        [
          new Txt('Representante:').bold().color(this.white).end,
          new Txt(
            item.diagnostico[0].establecimiento.representante
              ? item.diagnostico[0].establecimiento.representante.nombre
              : 'Sin Representante asignado'
          ).bold().end,
          new Txt('Correo:').bold().color(this.white).end,
          new Txt(item.diagnostico[0].establecimiento.email).bold().end
        ],
        [
          new Txt('Provincia:').bold().color(this.white).end,
          new Txt(item.diagnostico[0].establecimiento.provincia).bold().end,
          new Txt('Georeferenciación:').bold().color(this.white).end,
          new Txt(
            'Lat:' +
              item.diagnostico[0].establecimiento.lat +
              '\n' +
              'Lng: ' +
              item.diagnostico[0].establecimiento.lng
          ).bold().end
        ],
        [
          new Txt('Cantón:').bold().color(this.white).end,
          new Txt(item.diagnostico[0].establecimiento.canton).bold().end,
          new Txt('Área Protegida:').bold().color(this.white).end,
          new Txt(
            item.diagnostico[0].establecimiento.areaProtegida
              ? item.diagnostico[0].establecimiento.areaProtegida.tipo +
                ' - ' +
                item.diagnostico[0].establecimiento.areaProtegida.nombre
              : 'Sin Área protegida asignada'
          ).bold().end
        ],
        [
          new Txt('Parroquia:').bold().color(this.white).end,
          new Txt(item.diagnostico[0].establecimiento.parroquia).bold().end,
          new Txt('Registro:').bold().color(this.white).end,
          new Txt(item.diagnostico[0].establecimiento.registro).bold().end
        ],
        [
          new Txt('Ciudad o Localidad:').bold().color(this.white).end,
          new Txt(item.diagnostico[0].establecimiento.ciudad).bold().end,
          new Txt('LUAF:').bold().color(this.white).end,
          new Txt(item.diagnostico[0].establecimiento.LUAF).bold().end
        ]
      ])
        .widths([120, 120, 120, 120])
        .layout({
          fillColor: (rowIndex, node, columIndex) => {
            return columIndex === 0 || columIndex === 2 ? this.blue : ''
          }
        }).end
    )

    pdf.add(this.enter())

    //Resumen de Diagnosticos
    pdf.add(
      new Table(await this.resumenDiagnostico(item))
        .widths('*')
        .alignment('center')
        .layout({
          fillColor: (rowIndex, node, columIndex) => {
            return columIndex === 0 ? this.blue : ''
          }
        }).end
    )

    pdf.add(this.enter())

    //Actividades Turísticas
    pdf.add(
      new Table([await this.actividadesTuristicas(item)])
        .widths('*')
        .alignment('center')
        .layout({
          fillColor: (rowIndex, node, columIndex) => {
            return rowIndex === 0 && columIndex === 0 ? this.blue : ''
          }
        }).end
    )

    pdf.add(this.enter())

    //Productos Turísticos
    for (let i = 0; i < item.diagnostico.length; i++) {
      var mostrar = item.diagnostico[i].formulario.mostrarEnInforme
      if (mostrar != null) {
        pdf.add(
          new Table(
            await this.productoTuristico(
              item.diagnostico[i].formulario.pregunta[mostrar],
              item.diagnostico[i].respuesta[mostrar]
            )
          )
            .widths('*')
            .layout({
              fillColor: rowIndex => {
                return rowIndex === 0 ? this.blue : rowIndex === 1 ? this.gray : ''
              }
            })
            .alignment('center').end
        )

        pdf.add(this.enter())
      }
    }

    pdf.add(this.enter())

    //Observaciones
    pdf.add(new Txt('Observaciones').end)

    pdf.add(new Ul(await this.getPoints('observaciones', item)).end)

    pdf.add(this.enter())

    //Conclusiones
    pdf.add(new Txt('Conclusiones').end)

    pdf.add(new Ul(await this.getPoints('conclusiones', item)).end)

    pdf.add(this.enter())

    //Recomendaciones
    pdf.add(new Txt('Recomendaciones').end)

    pdf.add(new Ul(await this.getPoints('recomendaciones', item)).end)

    pdf.add(this.enter())

    //RealizadoPor Y AprobadoPor
    pdf.add(
      new Table([
        [
          new Txt('Realizado Por:').color(this.white).end,
          new Txt(item.realizadoPor.nombre + ' ' + item.realizadoPor.apellido).end,
          new Txt('Aprobado Por:').color(this.white).end,
          new Txt(item.responsable.nombre + ' ' + item.responsable.apellido).end
        ]
      ])
        .widths(['*', '*', '*', '*'])
        .layout({
          fillColor: (rowIndex, node, columnIndex) => {
            return columnIndex === 0 || columnIndex === 2 ? this.blue : ''
          }
        })
        .alignment('center')
        .pageBreak('after').end
    )

    //Diagnosticos
    for (let i = 0; i < item.diagnostico.length; i++) {
      //Nombre del formulario e imagenes
      pdf.add(
        new Table([
          [
            new Cell(await this.image('gobierno-diagnostico.png', 90, 40)).end,
            new Cell(await this.image('unach-diagnostico.jpeg', 90, 40)).end,
            new Cell(await this.image('municipio-diagnostico.jpeg', 90, 40)).end
          ]
        ])
          .widths('*')
          .alignment('center').end
      )

      pdf.add(
        new Table([
          [
            new Cell(
              new Txt(item.diagnostico[i].formulario.nombre)
                .bold()
                .fontSize(18)
                .color(this.white).end
            ).fillColor(this.primary).end
          ]
        ])
          .widths('*')
          .alignment('center').end
      )

      pdf.add(this.enter())

      //Pregunta
      for (let j = 0; j < item.diagnostico[i].formulario.pregunta.length; j++) {
        await pdf.add(
          new Txt(
            j + 1 + '.- ' + item.diagnostico[i].formulario.pregunta[j].enunciado
          ).bold().end
        )
        await pdf.add(
          new Txt(
            ' (Tipo: ' +
              (await this.getTipo(item.diagnostico[i].formulario.pregunta[j].tipo)) +
              ')'
          ).fontSize(10).end
        )

        pdf.add(this.enter())

        await pdf.add(
          this.respuesta(
            item.diagnostico[i].formulario.pregunta[j],
            item.diagnostico[i].respuesta[j]
          )
        )

        if (item.diagnostico[i].formulario.pregunta[j].tipo != 'COMPLEX') {
          pdf.add(this.enter())
        }

        await pdf.add(
          new Columns([
            new Txt('Calificación: ' + item.diagnostico[i].respuesta[j].puntaje).end,
            new Txt('Valor: ' + item.diagnostico[i].formulario.pregunta[j].peso).end
          ]).end
        )

        pdf.add(this.enter())
        pdf.add(this.enter())
      }
      if (i === item.diagnostico.length - 1) {
        pdf.add(new Txt('Total: ' + item.diagnostico[i].total).bold().end)
      } else {
        pdf.add(
          new Txt('Total: ' + item.diagnostico[i].total).bold().pageBreak('after').end
        )
      }
    }

    //Footer
    pdf.footer(
      new Table([
        [
          '',
          new Txt(
            'Universidad Nacional de Chimborazo\nVinculación con la Sociedad - Carrera de Gestión Turística y Hotelera'
          ).end
        ]
      ])
        .layout('noBorders')
        .widths([15, '*']).end
    )

    return pdf
  }

  //regresa la imagen
  static async image(item, x, y) {
    return await new Img('/img/' + item).fit([x, y]).build()
  }

  //separador
  static enter() {
    return new Txt('\n').end
  }

  //Devuelve el formato dependiendo del tipo de pregunta
  static respuesta(pregunta, respuesta) {
    var item = ''
    switch (pregunta.tipo) {
      case 'SN':
        item = new Txt(
          respuesta.valor != null ? (respuesta.valor ? 'Si' : 'No') : 'Sin responder'
        ).end
        break

      case 'ABIERTA':
        item = new Txt(respuesta.valor != null ? respuesta.valor : 'Sin responder').end
        break

      case 'MULTIPLE':
        item = new Ul(this.cuerpoMultiple(pregunta, respuesta.valor)).end
        break

      case 'SELECCION':
        item = new Ul(this.cuerpoSeleccion(pregunta, respuesta.valor)).end
        break

      default:
        item = this.cuerpoComplejo(pregunta, respuesta)
        break
    }
    return item
  }

  static cuerpoMultiple(pregunta, valor) {
    var array = []
    for (let i = 0; i < pregunta.opciones.length; i++) {
      if (valor[i] === null) {
        array.push(new Item(new Txt(pregunta.opciones[i]).end).listType('circle').end)
      } else {
        array.push(new Item(new Txt(pregunta.opciones[i]).end).bold().end)
      }
    }
    return array
  }

  static cuerpoSeleccion(pregunta, valor) {
    var array = []
    for (let i = 0; i < pregunta.opciones.length; i++) {
      if (valor === i) {
        array.push(new Item(new Txt(pregunta.opciones[i]).end).bold().end)
      } else {
        array.push(new Item(new Txt(pregunta.opciones[i]).end).listType('circle').end)
      }
    }
    return array
  }

  static cuerpoComplejo(pregunta, respuesta) {
    var array = []
    var header = []
    var item = []

    header = pregunta.encabezado.map(v => {
      return new Txt(v).bold().end
    })
    array.push(new Columns(header).end)

    for (let i = 0; i < respuesta.valor.length; i++) {
      item = []

      for (let j = 0; j < pregunta.encabezado.length; j++) {
        switch (pregunta.formato[j].tipo) {
          case 'SN':
            item.push(
              new Txt(
                respuesta.valor[i][j] != null
                  ? respuesta.valor[i][j]
                    ? 'Si'
                    : 'No'
                  : 'Sin responder'
              ).end
            )
            break
          case 'ABIERTA':
            item.push(
              new Txt(
                respuesta.valor[i][j] != null ? respuesta.valor[i][j] : 'Sin responder'
              ).end
            )
            break
          case 'MULTIPLE':
            item.push(
              new Ul(this.cuerpoMultiple(pregunta.formato[j], respuesta.valor[i][j])).end
            )
            break
          case 'SELECCION':
            item.push(
              new Ul(this.cuerpoSeleccion(pregunta.formato[j], respuesta.valor[i][j])).end
            )
            break
        }
      }
      array.push(new Columns(item).end)
      array.push('\n')
    }

    return array
  }

  static actividadesTuristicas(item) {
    var arreglo = []
    for (let i = -1; i < item.actividad.length; i++) {
      if (i === -1) {
        arreglo.push(new Txt('Actividades Turísticas:').color(this.white).end)
      } else {
        arreglo.push(new Txt(item.actividad[i]).end)
      }
    }
    return arreglo
  }

  static resumenDiagnostico(info) {
    var arreglo = []
    var item = []
    for (let i = 0; i < 5; i++) {
      item = []

      for (let j = -1; j < info.diagnostico.length; j++) {
        switch (j) {
          case -1:
            if (i === 0)
              item.push(
                new Cell(new Txt('Servicios Turísticos').color(this.white).end).rowSpan(2)
                  .end
              )

            if (i === 1) item.push(new Txt('').color(this.white).end)

            if (i === 2) item.push(new Txt('Clasificación / Tipo').color(this.white).end)

            if (i === 3) item.push(new Txt('Condición Porcentual').color(this.white).end)

            if (i === 4) item.push(new Txt('Personal Asignado').color(this.white).end)
            break

          default:
            if (i === 0) item.push(new Txt(info.diagnostico[j].formulario.nombre).end)

            if (i === 1) item.push(new Txt(info.servicio[j] ? 'X' : '').end)

            if (i === 2)
              item.push(
                new Txt(info.clasificacion[j] ? info.clasificacion[j] : 'No aplica').end
              )

            if (i === 3) item.push(new Txt(info.diagnostico[j].total).end)

            if (i === 4) item.push(new Txt(info.personal[j]).end)

            break
        }
      }
      arreglo.push(item)
    }

    return arreglo
  }

  static productoTuristico(pregunta, respuesta) {
    var array = []
    var item = []

    //TITULO DE LA TABLA
    for (let i = 0; i < pregunta.encabezado.length; i++) {
      if (i === 0) {
        item.push(
          new Cell(new Txt('Productos Turísticos').color(this.white).end).colSpan(
            pregunta.encabezado.length
          ).end
        )
      } else {
        item.push('')
      }
    }
    array.push(item)

    item = []
    //TITULOS DE LA TABLA
    item = pregunta.encabezado.map(v => {
      return new Txt(v).bold().end
    })
    array.push(item)

    // Respuestas
    for (let i = 0; i < respuesta.valor.length; i++) {
      item = []

      for (let j = 0; j < pregunta.encabezado.length; j++) {
        switch (pregunta.formato[j].tipo) {
          case 'SN':
            // item.push(new Txt(respuesta.valor[i][j] != null ? respuesta.valor[i][j] ? 'Si' : 'No' : 'Sin responder').end)
            item.push(
              new Txt(
                respuesta.valor[i][j] != null
                  ? respuesta.valor[i][j]
                    ? 'Si'
                    : 'No'
                  : 'Sin responder'
              ).end
            )
            break
          case 'ABIERTA':
            item.push(
              new Txt(
                respuesta.valor[i][j] != null ? respuesta.valor[i][j] : 'Sin responder'
              ).end
            )
            break
          case 'MULTIPLE':
            item.push(
              new Ul(this.cuerpoMultiple(pregunta.formato[j], respuesta.valor[i][j])).end
            )
            break
          case 'SELECCION':
            item.push(
              new Ul(this.cuerpoSeleccion(pregunta.formato[j], respuesta.valor[i][j])).end
            )
            break
        }
      }
      // array.push(new Columns(item).end)

      array.push(item)
    }
    return array
  }

  static getTelefono(item) {
    var text = ''
    for (let i = 0; i < item.length; i++) {
      if (i === 0) {
        text = item[0]
      } else {
        text = text + '\n' + item[i]
      }
    }
    return text
  }

  static getPoints(critery, item) {
    var array = []
    if (critery === 'observaciones') {
      for (let i = 0; i < item.observacion.length; i++) {
        if (item.observacion[i] === '') {
          array.push(new Item(new Txt('Vacío').bold().end).listType('square').end)
        } else {
          array.push(
            new Item(new Txt(item.observacion[i]).bold().end).listType('square').end
          )
        }
      }
    } else {
      if (critery === 'recomendaciones') {
        for (let i = 0; i < item.recomendacion.length; i++) {
          if (item.recomendacion[i] === '') {
            array.push(new Item(new Txt('Vacío').bold().end).listType('square').end)
          } else {
            array.push(
              new Item(new Txt(item.recomendacion[i]).bold().end).listType('square').end
            )
          }
        }
      } else {
        if (critery === 'conclusiones') {
          for (let i = 0; i < item.conclusion.length; i++) {
            if (item.conclusion[i] === '') {
              array.push(new Item(new Txt('Vacío').bold().end).listType('square').end)
            } else {
              array.push(
                new Item(new Txt(item.conclusion[i]).bold().end).listType('square').end
              )
            }
          }
        }
      }
    }
    return array
  }

  static getTipo(item) {
    if (item === 'COMPLEX') {
      return 'Compleja'
    } else {
      if (item === 'SN') {
        return 'Si y No'
      } else {
        if (item === 'ABIERTA') {
          return 'Abierta'
        } else {
          if (item === 'MULTIPLE') {
            return 'Opción Múltiple'
          } else {
            return 'Selección Múltiple'
          }
        }
      }
    }
  }
}
