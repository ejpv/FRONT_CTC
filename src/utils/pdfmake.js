import { PdfMakeWrapper, Cell, Txt, Table, Img, Ul, Item, Columns } from 'pdfmake-wrapper'
import pdfFonts from 'pdfmake/build/vfs_fonts'

PdfMakeWrapper.setFonts(pdfFonts)

export class Report {
    static primary = '#26A69A'
    static blue = '#44546A'
    static white = '#FFF'
    static gray = '#ACB9CA'

    //Abre el PDF
    static async openPDF() {
        await this.definition().then(res => {
            res.create().open()
        })
    }

    static async definition() {
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
                    new Txt('Respuesta').bold().end,
                    new Txt('Administrador:').bold().color(this.white).end,
                    new Txt('Respuesta').bold().end
                ],
                [
                    new Txt('Comunidad u Organización:').bold().color(this.white).end,
                    new Txt('Respuesta').bold().end,
                    new Txt('Teléfono:').bold().color(this.white).end,
                    new Txt('Respuesta').bold().end
                ],
                [
                    new Txt('Nacionalidad / Pueblo:').bold().color(this.white).end,
                    new Txt('Respuesta').bold().end,
                    new Txt('Página web:').bold().color(this.white).end,
                    new Txt('Respuesta').bold().end
                ],
                [
                    new Txt('Representante:').bold().color(this.white).end,
                    new Txt('Respuesta').bold().end,
                    new Txt('Correo:').bold().color(this.white).end,
                    new Txt('Respuesta').bold().end
                ],
                [
                    new Txt('Provincia:').bold().color(this.white).end,
                    new Txt('Respuesta').bold().end,
                    new Txt('Georeferenciación:').bold().color(this.white).end,
                    new Txt('Respuesta').bold().end
                ],
                [
                    new Txt('Cantón:').bold().color(this.white).end,
                    new Txt('Respuesta').bold().end,
                    new Txt('Área Protegida:').bold().color(this.white).end,
                    new Txt('Respuesta').bold().end
                ],
                [
                    new Txt('Parroquia:').bold().color(this.white).end,
                    new Txt('Respuesta').bold().end,
                    new Txt('Registro:').bold().color(this.white).end,
                    new Txt('Respuesta').bold().end
                ],
                [
                    new Txt('Localidad:').bold().color(this.white).end,
                    new Txt('Respuesta').bold().end,
                    new Txt('LUAF:').bold().color(this.white).end,
                    new Txt('Respuesta').bold().end
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

        //Tabla arriba de acyividades turisticas

        //Actividades Turísticas
        pdf.add(
            new Table([
                [
                    new Cell(new Txt('Actividades Turísticas:').color(this.white).end).rowSpan(2)
                        .end,
                    new Txt('Senderismo').end,
                    new Txt('Escalada').end,
                    new Txt('Ciclismo').end,
                    new Txt('Cabalgata').end,
                    new Txt('Eventos').end
                ],
                [
                    '',
                    new Txt('').end,
                    new Txt('').end,
                    new Txt('').end,
                    new Txt('').end,
                    new Txt('x').end
                ]
            ])
                .widths(['*', '*', '*', '*', '*', '*'])
                .alignment('center')
                .layout({
                    fillColor: (rowIndex, node, columIndex) => {
                        return rowIndex === 0 && columIndex === 0
                            ? this.blue
                            : columIndex === 0
                                ? this.blue
                                : rowIndex === 0
                                    ? this.gray
                                    : ''
                    }
                }).end
        )

        pdf.add(this.enter())

        //Productos Turísticos
        pdf.add(
            new Table([
                [
                    new Cell(new Txt('Productos Turísticos').color(this.white).end).colSpan(4).end,
                    '',
                    '',
                    ''
                ],
                [
                    new Txt('Nombre').end,
                    new Txt('Servicio').end,
                    new Txt('Actividades').end,
                    new Txt('Atractivos').end
                ],
                [' ', ' ', ' ', ' '],
                [' ', ' ', ' ', ' ']
            ])
                .widths(['*', '*', '*', '*'])
                .layout({
                    fillColor: rowIndex => {
                        return rowIndex === 0 ? this.blue : rowIndex === 1 ? this.gray : ''
                    }
                })
                .alignment('center').end
        )

        pdf.add(this.enter())

        //Mercado y Comercializacion
        pdf.add(
            new Table([
                [new Txt('Mercado').color(this.white).end, new Txt('Nacional').end],
                [new Txt('Comercialización').color(this.white).end, new Txt('Directa').end]
            ])
                .widths(['*', '*'])
                .layout({
                    fillColor: (rowIndex, node, columnIndex) => {
                        return columnIndex === 0 ? this.blue : ''
                    }
                })
                .alignment('center').end
        )

        pdf.add(this.enter())

        //Observaciones
        pdf.add(new Txt('Observaciones').end)

        pdf.add(
            new Ul([
                new Item(new Txt('Item 1').bold().end).listType('square').end,

                new Item(new Txt('Item 2').bold().end).listType('square').end
            ]).end
        )

        pdf.add(this.enter())

        //Conclusiones
        pdf.add(new Txt('Conclusiones').end)

        pdf.add(
            new Ul([
                new Item(new Txt('Item 1').bold().end).listType('square').end,

                new Item(new Txt('Item 2').bold().end).listType('square').end
            ]).end
        )

        pdf.add(this.enter())

        //Recomendaciones
        pdf.add(new Txt('Recomendaciones').end)

        pdf.add(
            new Ul([
                new Item(new Txt('Item 1').bold().end).listType('square').end,

                new Item(new Txt('Item 2').bold().end).listType('square').end
            ]).end
        )

        pdf.add(this.enter())

        //RealizadoPor Y AprobadoPor
        pdf.add(
            new Table([
                [
                    new Txt('Realizado Por:').color(this.white).end,
                    new Txt('Alexis Mauricio Guamán Criollo').end,
                    new Txt('Aprobado Por:').color(this.white).end,
                    new Txt(' Ing. Daniel Guerrero, Mgs.Docente').end
                ]
            ])
                .widths(['*', '*', '*', '*'])
                .layout({
                    fillColor: (rowIndex, node, columnIndex) => {
                        return columnIndex === 0 || columnIndex === 2 ? this.blue : ''
                    }
                })
                .alignment('center').end
        )

        pdf.add(this.enter())

        //Diagnosticos
        for (let j = 0; j < 3; j++) {
            //Nombre del formulario e imagenes
            pdf.add(
                new Table([
                    [
                        new Cell(await this.image('unachDiagnostico.png', 90, 40)).end,

                        new Cell(
                            new Txt('Nombre del formulario')
                                .bold()
                                .fontSize(14)
                                .color(this.white).end
                        ).fillColor(this.primary).end,

                        new Cell(await this.image('turismoDiagnostico.png', 90, 40)).end
                    ]
                ])
                    .widths([90, '*', 90])
                    .layout({ paddingTop: () => 10 })
                    .alignment('center').end
            )

            pdf.add(this.enter())

            //Pregunta
            for (let i = 1; i <= 50; i++) {
                await pdf.add(
                    new Columns([
                        [new Txt('Pregunta #' + i).bold().end, new Txt('Nombre de la pregunta ').end],
                        new Txt('Tipo de la pregunta').end
                    ]).end
                )

                await pdf.add(this.cuerpoPregunta())
                //await pdf.add(new Columns([new Txt('Respuesta: ').bold().end, new Txt('Respuesta').end]).end)

                await pdf.add(
                    new Columns([
                        new Txt('Puntaje de la pregunta: ').bold().end,
                        new Txt('total/valor por pregunta').end
                    ]).end
                )

                pdf.add(this.enter())
            }

            pdf.add(new Txt('Total: ' + 'VALOR TOTAL').end)

            pdf.add(this.enter())
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
        //pa pruebas
        return await new Img('http://localhost:3000/img/' + item).fit([x, y]).build()
        //pa produccion
        //return await new Img('http://localhost:3000/img/' + item).fit([x, y]).build()
    }

    //separador
    static enter() {
        return new Txt('\n').end
    }

    //Devuelve el formato dependiendo del tipo de pregunta
    static cuerpoPregunta() {
        return new Txt('Respuesta de algún tipo').end
    }
}
