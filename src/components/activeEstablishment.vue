<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="establishments"
      class="elevation-1"
      :loading="loading"
      :search="this.texto"
      loading-text="Obteniendo todos los Establecimientos..."
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-container>
            <v-row>
              <v-col align="start" cols="3" sm="2"> </v-col>
              <v-col align="end" cols="0" sm="10">
                <v-dialog v-model="dialog" max-width="500px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn color="new" dark class="mb-2" v-bind="attrs" v-on="on" medium>
                      Nuevo Establecimiento
                      <v-icon right>fa-store-alt</v-icon>
                    </v-btn>
                    <v-btn color="info" class="mb-2 ml-4" medium icon>
                      <v-icon medium @click="getEstablishments()">fa-sync-alt</v-icon>
                    </v-btn>
                  </template>

                  <v-card>
                    <v-card-title class="primary white--text">
                      <span class="headline">{{ formTitle }}</span>
                    </v-card-title>
                    <v-stepper v-model="step" vertical>
                      <v-stepper-step :complete="step > 1" step="1" :editable="editable">
                        Seleccione un Lugar
                        <small>Seleccione o cree un Lugar.</small>
                      </v-stepper-step>

                      <v-stepper-content step="1">
                        <v-card elevation="0">
                          <v-card-text>
                            <v-row>
                              <v-col align="end" cols="9" sm="10">
                                <v-text-field
                                  v-model="searchPlace"
                                  filled
                                  rounded
                                  dense
                                ></v-text-field>
                              </v-col>
                              <v-col align="start" cols="2">
                                <v-menu offset-y>
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-btn
                                      v-bind="attrs"
                                      v-on="on"
                                      text
                                      rounded
                                      dense
                                      style="margin-left: -15px"
                                      :disabled="places.length === 0"
                                      class="secondary--text"
                                    >
                                      <v-tooltip bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                          <v-icon v-on="on" v-bind="attrs">
                                            fa-caret-down</v-icon
                                          >
                                        </template>
                                        <span> Lugares sin asignar </span>
                                      </v-tooltip>
                                    </v-btn>
                                  </template>
                                  <v-list>
                                    <v-list-item
                                      v-for="(item, index) in places"
                                      :key="index"
                                    >
                                      <v-list-item-title @click="selectPlace(item)"
                                        >{{ item.canton }} - {{ item.parroquia }}
                                      </v-list-item-title>
                                      <v-list-item-icon class="d-block text-center">
                                        <v-tooltip bottom>
                                          <template v-slot:activator="{ on, attrs }">
                                            <v-icon
                                              class="edit--text"
                                              @click="showMap(false, item)"
                                              v-on="on"
                                              v-bind="attrs"
                                            >
                                              fa-map-marker-alt
                                            </v-icon>
                                          </template>
                                          <span> Elegir punto en mapa </span>
                                        </v-tooltip>
                                      </v-list-item-icon>
                                    </v-list-item>
                                    <v-divider></v-divider>
                                  </v-list>
                                </v-menu>
                              </v-col>
                            </v-row>
                            <v-form ref="formPlace">
                              <h3 class="pb-1">
                                <strong class="error--text">*</strong> Provincia
                              </h3>
                              <v-text-field
                                v-model="editedPlace.provincia"
                                filled
                                rounded
                                dense
                                :disabled="disable"
                                :rules="fieldRules"
                              ></v-text-field>

                              <h3 class="pb-1">
                                <strong class="error--text">*</strong> Cantón
                              </h3>
                              <v-text-field
                                v-model="editedPlace.canton"
                                filled
                                rounded
                                dense
                                :disabled="disable"
                                :rules="fieldRules"
                              ></v-text-field>

                              <h3 class="pb-1">Ciudad</h3>
                              <v-text-field
                                v-model="editedPlace.ciudad"
                                filled
                                rounded
                                dense
                                :disabled="disable"
                              ></v-text-field>

                              <h3 class="pb-1">
                                <strong class="error--text">*</strong> Parroquia
                              </h3>
                              <v-text-field
                                v-model="editedPlace.parroquia"
                                filled
                                rounded
                                dense
                                :disabled="disable"
                                :rules="fieldRules"
                              ></v-text-field>

                              <v-row style="margin-top: -15px">
                                <v-col>
                                  <h3 class="pb-3">
                                    <strong class="error--text">*</strong> Coordenadas
                                  </h3>
                                </v-col>
                                <v-col align="end">
                                  <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                      <v-icon
                                        class="edit--text"
                                        @click="showMap(!disable)"
                                        v-on="on"
                                        v-bind="attrs"
                                      >
                                        fa-map-marker-alt
                                      </v-icon>
                                    </template>
                                    <span> Elegir punto en mapa </span>
                                  </v-tooltip>
                                </v-col>
                              </v-row>

                              <h4 class="pb-1">Latitud</h4>
                              <v-text-field
                                v-model="editedPlace.lat"
                                filled
                                rounded
                                dense
                                :disabled="disable"
                                :rules="numberRules"
                              ></v-text-field>

                              <h4 class="pb-1">Longitud</h4>
                              <v-text-field
                                v-model="editedPlace.lng"
                                filled
                                rounded
                                dense
                                :disabled="disable"
                                :rules="numberRules"
                              ></v-text-field>
                            </v-form>
                          </v-card-text>
                        </v-card>
                        <v-card-actions>
                          <v-container>
                            <v-row>
                              <v-col cols="5" class="d-flex justify-space-around pa-0">
                                <v-btn text @click="close">Cancelar</v-btn>
                              </v-col>
                              <v-col cols="5" class="d-flex justify-space-around pa-0">
                                <v-btn text @click="validateForm('place')"
                                  >Continuar</v-btn
                                >
                              </v-col>
                              <v-col cols="2" class="d-flex justify-end pa-0">
                                <v-tooltip bottom>
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-icon
                                      class="warning--text"
                                      @click="clear('place')"
                                      v-on="on"
                                      v-bind="attrs"
                                    >
                                      fa-undo-alt
                                    </v-icon>
                                  </template>
                                  <span> Reestablecer item </span>
                                </v-tooltip>
                              </v-col>
                            </v-row>
                          </v-container>
                        </v-card-actions>
                      </v-stepper-content>

                      <v-stepper-step :complete="step > 2" step="2" :editable="editable">
                        Seleccione un Área Protegida
                      </v-stepper-step>

                      <v-stepper-content step="2">
                        <v-card elevation="0">
                          <v-card-text>
                            <v-row>
                              <v-col align="end" cols="9" sm="10">
                                <v-text-field
                                  v-model="searchArea"
                                  filled
                                  rounded
                                  dense
                                ></v-text-field>
                              </v-col>
                              <v-col align="start" cols="2">
                                <v-menu offset-y>
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-btn
                                      v-bind="attrs"
                                      v-on="on"
                                      text
                                      rounded
                                      dense
                                      style="margin-left: -15px"
                                      :disabled="areas.length === 0"
                                      class="secondary--text"
                                    >
                                      <v-tooltip bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                          <v-icon v-on="on" v-bind="attrs">
                                            fa-caret-down</v-icon
                                          >
                                        </template>
                                        <span> Áreas Protegidas sin asignar </span>
                                      </v-tooltip>
                                    </v-btn>
                                  </template>
                                  <v-list>
                                    <v-list-item
                                      v-for="(item, index) in areas"
                                      :key="index"
                                    >
                                      <v-list-item-title @click="selectArea(item)"
                                        >{{ item.nombre }} - {{ item.tipo }}
                                      </v-list-item-title>
                                    </v-list-item>
                                    <v-divider></v-divider>
                                  </v-list>
                                </v-menu>
                              </v-col>
                            </v-row>
                            <h3 class="pt-2 pb-1">Nombre</h3>
                            <v-text-field
                              v-model="editedArea.nombre"
                              filled
                              rounded
                              dense
                              disabled
                            ></v-text-field>

                            <h3>Tipo</h3>
                            <v-text-field
                              v-model="editedArea.tipo"
                              filled
                              rounded
                              dense
                              disabled
                            ></v-text-field>
                          </v-card-text>
                        </v-card>
                        <v-card-actions>
                          <v-container>
                            <v-row>
                              <v-col cols="5" class="d-flex justify-space-around pa-0">
                                <v-btn text @click="close">Cancelar</v-btn>
                              </v-col>
                              <v-col cols="5" class="d-flex justify-space-around pa-0">
                                <v-btn text @click="step = 3">Continuar</v-btn>
                              </v-col>
                              <v-col cols="2" class="d-flex justify-end pa-0">
                                <v-tooltip bottom>
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-icon
                                      class="warning--text"
                                      @click="clear('area')"
                                      v-on="on"
                                      v-bind="attrs"
                                    >
                                      fa-undo-alt
                                    </v-icon>
                                  </template>
                                  <span> Reestablecer item </span>
                                </v-tooltip>
                              </v-col>
                            </v-row>
                          </v-container>
                        </v-card-actions>
                      </v-stepper-content>

                      <v-stepper-step :complete="step > 3" step="3" :editable="editable">
                        Seleccione un Representante
                      </v-stepper-step>

                      <v-stepper-content step="3">
                        <v-card elevation="0">
                          <v-card-text>
                            <v-row>
                              <v-col align="end" cols="9" sm="10">
                                <v-text-field
                                  v-model="searchRepresentant"
                                  filled
                                  rounded
                                  dense
                                ></v-text-field>
                              </v-col>
                              <v-col align="start" cols="2">
                                <v-menu offset-y>
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-btn
                                      v-bind="attrs"
                                      v-on="on"
                                      text
                                      rounded
                                      dense
                                      style="margin-left: -15px"
                                      :disabled="representants.length === 0"
                                      class="secondary--text"
                                    >
                                      <v-tooltip bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                          <v-icon v-on="on" v-bind="attrs">
                                            fa-caret-down</v-icon
                                          >
                                        </template>
                                        <span>
                                          Representantes con usuario, sin asignar
                                        </span>
                                      </v-tooltip>
                                    </v-btn>
                                  </template>
                                  <v-list>
                                    <v-list-item
                                      v-for="(item, index) in representants"
                                      :key="index"
                                    >
                                      <v-list-item-title
                                        @click="selectRepresentant(item)"
                                      >
                                        {{ item.nombre }} {{ item.apellido }} -
                                        {{ item.cedula }}
                                      </v-list-item-title>
                                    </v-list-item>
                                    <v-divider></v-divider>
                                  </v-list>
                                </v-menu>
                              </v-col>
                            </v-row>
                            <h3 class="pb-1">Nombre</h3>
                            <v-text-field
                              v-model="editedRepresentant.nombre"
                              filled
                              rounded
                              dense
                              disabled
                            ></v-text-field>

                            <h3 class="pb-1">Apellido</h3>
                            <v-text-field
                              v-model="editedRepresentant.apellido"
                              filled
                              rounded
                              dense
                              disabled
                            ></v-text-field>

                            <h3 class="pb-1">Cédula</h3>
                            <v-text-field
                              v-model="editedRepresentant.cedula"
                              filled
                              rounded
                              dense
                              disabled
                            ></v-text-field>

                            <h3 class="pb-1">Correo</h3>
                            <v-text-field
                              v-model="editedRepresentant.email"
                              filled
                              rounded
                              dense
                              disabled
                            ></v-text-field>

                            <h3 class="pb-1">Teléfono</h3>
                            <v-text-field
                              v-model="editedRepresentant.telefono"
                              filled
                              rounded
                              dense
                              disabled
                            ></v-text-field>

                            <h3 class="pb-1">Dirección</h3>
                            <v-textarea
                              auto-grow
                              filled
                              rounded
                              dense
                              rows="1"
                              row-height="15"
                              v-model="editedRepresentant.direccion"
                              disabled
                            ></v-textarea>

                            <h3 class="pb-1">Usuario Asignado</h3>
                            <v-text-field
                              v-model="editedRepresentant.usuario.nombre"
                              filled
                              rounded
                              dense
                              disabled
                            ></v-text-field>
                          </v-card-text>
                        </v-card>
                        <v-card-actions>
                          <v-container>
                            <v-row>
                              <v-col cols="5" class="d-flex justify-space-around pa-0">
                                <v-btn text @click="close">Cancelar</v-btn>
                              </v-col>
                              <v-col cols="5" class="d-flex justify-space-around pa-0">
                                <v-btn text @click="step = 4">Continuar</v-btn>
                              </v-col>
                              <v-col cols="2" class="d-flex justify-end pa-0">
                                <v-tooltip bottom>
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-icon
                                      class="warning--text"
                                      @click="clear('representant')"
                                      v-on="on"
                                      v-bind="attrs"
                                    >
                                      fa-undo-alt
                                    </v-icon>
                                  </template>
                                  <span> Reestablecer item </span>
                                </v-tooltip>
                              </v-col>
                            </v-row>
                          </v-container>
                        </v-card-actions>
                      </v-stepper-content>

                      <v-stepper-step :complete="step > 4" step="4" :editable="editable">
                        Cree un Establecimiento
                      </v-stepper-step>

                      <v-stepper-content step="4">
                        <v-card elevation="0">
                          <v-card-text>
                            <v-form ref="formSave">
                              <h3 class="pb-1">
                                <strong class="error--text">*</strong>
                                Nombre
                              </h3>
                              <v-text-field
                                v-model="editedItem.nombre"
                                filled
                                rounded
                                dense
                                :rules="fieldRules"
                              ></v-text-field>

                              <h3 class="pb-1">
                                <strong class="error--text">*</strong>Administrador
                              </h3>
                              <v-text-field
                                v-model="editedItem.administrador"
                                filled
                                rounded
                                dense
                                :rules="fieldRules"
                              ></v-text-field>

                              <h3 class="pb-1">Correo</h3>
                              <v-text-field
                                v-model="editedItem.email"
                                filled
                                rounded
                                dense
                              ></v-text-field>

                              <h3 class="pb-1">Nacionalidad / Pueblo</h3>
                              <v-text-field
                                v-model="editedItem.nacionalidad"
                                filled
                                rounded
                                dense
                              ></v-text-field>

                              <h3 class="pb-1">Registro</h3>
                              <v-text-field
                                v-model="editedItem.registro"
                                filled
                                rounded
                                dense
                              ></v-text-field>

                              <h3 class="pb-1">Página web</h3>
                              <v-text-field
                                v-model="editedItem.web"
                                filled
                                rounded
                                dense
                              ></v-text-field>

                              <h3 class="pb-1">Teléfono</h3>
                              <v-text-field
                                v-model="editedItem.telefono"
                                filled
                                rounded
                                dense
                              ></v-text-field>

                              <h3 class="pb-1">Lugar</h3>
                              <v-text-field
                                v-model="editedPlace.parroquia"
                                filled
                                rounded
                                dense
                                disabled
                              ></v-text-field>

                              <h3 class="pb-1">Área Protegida</h3>
                              <v-text-field
                                v-model="editedArea.nombre"
                                filled
                                rounded
                                dense
                                disabled
                              ></v-text-field>

                              <h3 class="pb-1">Representante</h3>
                              <v-text-field
                                v-model="editedRepresentant.nombre"
                                filled
                                rounded
                                dense
                                disabled
                              ></v-text-field>
                            </v-form>
                          </v-card-text>
                        </v-card>
                        <v-card-actions>
                          <v-container>
                            <v-row>
                              <v-col cols="5" class="d-flex justify-space-around pa-0">
                                <v-btn text @click="close">Cancelar</v-btn>
                              </v-col>
                              <v-col cols="5" class="d-flex justify-space-around pa-0">
                                <v-btn text @click="validateForm('establishment')"
                                  >Continuar</v-btn
                                >
                              </v-col>
                              <v-col cols="2" class="d-flex justify-end pa-0">
                                <v-tooltip bottom>
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-icon
                                      class="warning--text"
                                      @click="editedItem = defaultItem"
                                      v-on="on"
                                      v-bind="attrs"
                                    >
                                      fa-undo-alt
                                    </v-icon>
                                  </template>
                                  <span> Reestablecer item </span>
                                </v-tooltip>
                              </v-col>
                            </v-row>
                          </v-container>
                        </v-card-actions>
                      </v-stepper-content>
                    </v-stepper>
                  </v-card>
                </v-dialog>
              </v-col>
            </v-row>
          </v-container>
        </v-toolbar>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              class="mr-2 edit--text"
              @click="editItem(item)"
              v-on="on"
              v-bind="attrs"
            >
              fa-pen
            </v-icon>
          </template>
          <span> Editar un Establecimiento </span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              class="ma-2 delete--text"
              @click="deleteItem(item)"
              v-on="on"
              v-bind="attrs"
            >
              fa-trash
            </v-icon>
          </template>
          <span> Eliminar un Establecimiento </span>
        </v-tooltip>
      </template>

      <template v-slot:item.estado="">
        <v-chip color="success" dark> Activo </v-chip>
      </template>

      <template v-slot:item.representante="{ item }">
        <div v-if="item.representante">
          <v-chip color="success" dark> Asignado </v-chip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                class="info--text ml-2"
                v-on="on"
                v-bind="attrs"
                @click="showObject('representant', item)"
              >
                fa-eye
              </v-icon>
            </template>
            <span> Ver Representante</span>
          </v-tooltip>
        </div>
        <div v-else>
          <v-chip color="warning" dark> Sin Asignar </v-chip>
        </div>
      </template>

      <template v-slot:item.areaProtegida="{ item }">
        <div v-if="item.areaProtegida">
          <v-chip color="success" dark> Asignado </v-chip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                class="info--text ml-2"
                v-on="on"
                v-bind="attrs"
                @click="showObject('area', item)"
              >
                fa-eye
              </v-icon>
            </template>
            <span> Ver Área Protegida</span>
          </v-tooltip>
        </div>
        <div v-else>
          <v-chip color="warning" dark> Sin Asignar </v-chip>
        </div>
      </template>

      <template v-slot:item.lugar="{ item }">
        <v-chip color="success" dark> {{ item.lugar.parroquia }} </v-chip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              class="info--text ml-2"
              v-on="on"
              v-bind="attrs"
              @click="showObject('place', item)"
            >
              fa-eye
            </v-icon>
          </template>
          <span> Ver Lugar</span>
        </v-tooltip>
      </template>
    </v-data-table>

    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-container class="primary">
          <v-row text-centerd>
            <v-col cols="12" class="text-center">
              <v-icon dark large> fa-exclamation-triangle </v-icon>
            </v-col>
            <v-col cols="12" class="white--text justify-center">
              <div class="text-center primary">
                <span class="headline">
                  ¿Está seguro de borrar este Establecimiento?</span
                >
              </div>
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-container>
            <v-row>
              <v-col cols="6" class="d-flex justify-space-around pa-0"
                ><v-btn text @click="closeDelete">Cancelar</v-btn></v-col
              >
              <v-col cols="6" class="d-flex justify-space-around pa-0"
                ><v-btn text @click="deleteItemConfirm">Continuar</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogMap" max-width="600px">
      <v-card>
        <v-card-title class="primary white--text" v-if="editMap">
          <span class="headline">Elija un punto en el mapa</span>
        </v-card-title>
        <v-card-title class="primary white--text" v-else>
          <span class="headline">Localización Actual</span>
        </v-card-title>
        <ctcMap
          :coordinates="coordinates"
          @close="closeMap"
          @save="saveCoordinates"
          :mapChange="dialogMap"
          :edit="editMap"
        />
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogRepresentant" max-width="500px">
      <v-card v-if="editedItem.representante">
        <v-card-title class="primary white--text">
          <span class="headline">Representante</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <h3 class="pb-1">Nombre</h3>
            <v-text-field
              v-model="editedItem.representante.nombre"
              filled
              rounded
              dense
              disabled
            ></v-text-field>

            <h3 class="pb-1">Apellido</h3>
            <v-text-field
              v-model="editedItem.representante.apellido"
              filled
              rounded
              dense
              disabled
            ></v-text-field>

            <h3 class="pb-1">Cédula</h3>
            <v-text-field
              v-model="editedItem.representante.cedula"
              filled
              rounded
              dense
              disabled
            ></v-text-field>

            <h3 class="pb-1">Correo</h3>
            <v-text-field
              v-model="editedItem.representante.email"
              filled
              rounded
              dense
              disabled
            ></v-text-field>

            <h3 class="pb-1">Teléfono</h3>
            <v-text-field
              v-model="editedItem.representante.telefono"
              filled
              rounded
              dense
              disabled
            ></v-text-field>

            <h3 class="pb-1">Dirección</h3>
            <v-textarea
              auto-grow
              filled
              rounded
              dense
              rows="1"
              row-height="15"
              v-model="editedItem.representante.direccion"
              disabled
            ></v-textarea>

            <h3 class="pb-1">Usuario Asignado</h3>
            <div v-if="editedItem.representante.usuario">
              <v-chip color="success" dark> Tiene un Usuario asignado </v-chip>
            </div>
            <div v-else>
              <v-chip color="warning" dark> No tiene Usuario asignado </v-chip>
            </div>
          </v-container>
        </v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" class="d-flex justify-space-around pa-0">
              <v-btn text @click="closeObject('representant')">Cerrar</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogEdit" max-width="500px">
      <v-card>
        <v-card-title class="primary white--text">
          <span class="headline">Editar un Establecimiento</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form">
              <h3 class="pt-2 pb-1"><strong class="error--text">*</strong> Nombre</h3>

              <v-text-field
                v-model="editedItem.nombre"
                filled
                rounded
                dense
              ></v-text-field>

              <h3 class="pb-1"><strong class="error--text">*</strong> Administrador</h3>
              <v-text-field
                v-model="editedItem.administrador"
                filled
                rounded
                dense
              ></v-text-field>

              <h3 class="pb-1">Correo</h3>
              <v-text-field
                v-model="editedItem.email"
                filled
                rounded
                dense
              ></v-text-field>

              <h3 class="pb-1">Nacionalidad / Pueblo</h3>
              <v-text-field
                v-model="editedItem.nacionalidad"
                filled
                rounded
                dense
              ></v-text-field>

              <h3 class="pb-1">Registro</h3>
              <v-text-field
                v-model="editedItem.registro"
                filled
                rounded
                dense
              ></v-text-field>

              <h3 class="pb-1">Página web</h3>
              <v-text-field v-model="editedItem.web" filled rounded dense></v-text-field>

              <h3 class="pb-1">Teléfono</h3>
              <v-text-field
                v-model="editedItem.telefono"
                filled
                rounded
                dense
              ></v-text-field>

              <h3 class="pb-1"><strong class="error--text">*</strong> Lugar</h3>
              <v-row>
                <v-col align="end" cols="10">
                  <v-text-field
                    v-model="editedItem.lugar.parroquia"
                    filled
                    rounded
                    dense
                    :rules="fieldRules"
                    append-icon="fa-eye"
                    color="orange"
                    @click:append="showObject('place', editedItem)"
                  ></v-text-field>
                </v-col>
                <v-col align="start" cols="1">
                  <v-menu offset-y>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        v-bind="attrs"
                        v-on="on"
                        text
                        rounded
                        dense
                        style="margin-left: -15px"
                        :disabled="places.length === 0"
                        class="secondary--text"
                      >
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon v-on="on" v-bind="attrs"> fa-caret-down</v-icon>
                          </template>
                          <span> Lugares sin asignar </span>
                        </v-tooltip>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item v-for="(item, index) in places" :key="index">
                        <v-list-item-title @click="selectItemEdit('place', item)"
                          >{{ item.canton }} - {{ item.parroquia }}
                        </v-list-item-title>
                        <v-list-item-icon class="d-block text-center">
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon
                                class="edit--text"
                                @click="showMap(false, item)"
                                v-on="on"
                                v-bind="attrs"
                              >
                                fa-map-marker-alt
                              </v-icon>
                            </template>
                            <span> Elegir punto en mapa </span>
                          </v-tooltip>
                        </v-list-item-icon>
                      </v-list-item>
                      <v-divider></v-divider>
                    </v-list>
                  </v-menu>
                </v-col>
              </v-row>

              <h3 class="pb-1">Área Protegida</h3>
              <v-row>
                <v-col align="end" cols="10">
                  <div v-if="editedItem.areaProtegida">
                    <v-text-field
                      v-model="editedItem.areaProtegida.nombre"
                      filled
                      rounded
                      dense
                      :append-icon="editedItem.areaProtegida.nombre ? 'fa-eye' : null"
                      color="orange"
                      @click:append="showObject('area', editedItem)"
                    ></v-text-field>
                  </div>
                  <div v-else>
                    <v-text-field filled rounded dense></v-text-field>
                  </div>
                </v-col>
                <v-col align="start" cols="1">
                  <v-menu offset-y>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        v-bind="attrs"
                        v-on="on"
                        text
                        rounded
                        dense
                        style="margin-left: -15px"
                        :disabled="areas.length === 0"
                        class="secondary--text"
                      >
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon v-on="on" v-bind="attrs"> fa-caret-down</v-icon>
                          </template>
                          <span> Áreas Protegidas sin asignar </span>
                        </v-tooltip>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item v-for="(item, index) in areas" :key="index">
                        <v-list-item-title @click="selectItemEdit('area', item)"
                          >{{ item.nombre }} - {{ item.tipo }}
                        </v-list-item-title>
                      </v-list-item>
                      <v-divider></v-divider>
                    </v-list>
                  </v-menu>
                </v-col>
              </v-row>

              <h3 class="pb-1">Representante</h3>
              <v-row>
                <v-col align="end" cols="10">
                  <div v-if="editedItem.representante">
                    <v-text-field
                      v-model="editedItem.representante.nombre"
                      filled
                      rounded
                      dense
                      :append-icon="editedItem.representante.nombre ? 'fa-eye' : null"
                      color="orange"
                      @click:append="showObject('representant', editedItem)"
                    ></v-text-field>
                  </div>
                  <div v-else>
                    <v-text-field filled rounded dense></v-text-field>
                  </div>
                </v-col>
                <v-col align="start" cols="1">
                  <v-menu offset-y>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        v-bind="attrs"
                        v-on="on"
                        text
                        rounded
                        dense
                        style="margin-left: -15px"
                        :disabled="representants.length === 0"
                        class="secondary--text"
                      >
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon v-on="on" v-bind="attrs"> fa-caret-down</v-icon>
                          </template>
                          <span> Representantes con usuario, sin asignar </span>
                        </v-tooltip>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item v-for="(item, index) in representants" :key="index">
                        <v-list-item-title @click="selectItemEdit('representant', item)"
                          >{{ item.nombre }} {{ item.apellido }} - {{ item.cedula }}
                        </v-list-item-title>
                      </v-list-item>
                      <v-divider></v-divider>
                    </v-list>
                  </v-menu>
                </v-col>
              </v-row>
              <v-card-actions>
                <v-container>
                  <v-row>
                    <v-col cols="6" class="d-flex justify-space-around pa-0">
                      <v-btn text @click="close">Cancelar</v-btn>
                    </v-col>
                    <v-col cols="6" class="d-flex justify-space-around pa-0">
                      <v-btn text @click="save">Guardar</v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-actions>
            </v-form>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogPlace" max-width="500px">
      <v-card>
        <v-card-title class="primary white--text">
          <span class="headline">Lugar</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <h3 class="pb-1">Provincia</h3>
            <v-text-field
              v-model="editedItem.lugar.provincia"
              filled
              rounded
              dense
              disabled
            ></v-text-field>

            <h3 class="pb-1">Cantón</h3>
            <v-text-field
              v-model="editedItem.lugar.canton"
              filled
              rounded
              dense
              disabled
            ></v-text-field>

            <h3 class="pb-1">Ciudad</h3>
            <v-text-field
              v-model="editedItem.lugar.ciudad"
              filled
              rounded
              dense
              disabled
            ></v-text-field>

            <h3 class="pb-1">Parroquia</h3>
            <v-text-field
              v-model="editedItem.lugar.parroquia"
              filled
              rounded
              dense
              disabled
            ></v-text-field>

            <v-row style="margin-top: -15px">
              <v-col>
                <h3 class="pb-3">Coordenadas</h3>
              </v-col>
              <v-col align="end">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      class="edit--text"
                      @click="showMap(false)"
                      v-on="on"
                      v-bind="attrs"
                    >
                      fa-map-marker-alt
                    </v-icon>
                  </template>
                  <span> Ver en el mapa </span>
                </v-tooltip>
              </v-col>
            </v-row>

            <h4 class="pb-1">Latitud</h4>
            <v-text-field
              v-model="editedItem.lugar.lat"
              filled
              rounded
              dense
              disabled
            ></v-text-field>

            <h4 class="pb-1">Longitud</h4>
            <v-text-field
              v-model="editedItem.lugar.lng"
              filled
              rounded
              dense
              disabled
            ></v-text-field>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-container>
            <v-row>
              <v-col cols="12" class="d-flex justify-space-around pa-0">
                <v-btn text @click="closeObject('place')">Cerrar</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogArea" max-width="500px">
      <v-card v-if="editedItem.areaProtegida">
        <v-card-title class="primary white--text">
          <span class="headline">Área Protegida</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <h3 class="pt-2 pb-1">Nombre</h3>
            <v-text-field
              v-model="editedItem.areaProtegida.nombre"
              filled
              rounded
              dense
              disabled
            ></v-text-field>

            <h3>Tipo</h3>

            <v-text-field
              v-model="editedItem.areaProtegida.tipo"
              filled
              rounded
              dense
              disabled
            ></v-text-field>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-container>
            <v-row>
              <v-col cols="12" class="d-flex justify-space-around pa-0">
                <v-btn text @click="closeObject">Cerrar</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { swalError, swalConfirm, swalLoading } from '@/utils/notify'
export default {
  props: ['texto', 'activator'],
  data() {
    return {
      changed: false,
      validate: false,
      loading: false,
      searchPlace: '',
      searchArea: '',
      searchRepresentant: '',
      dialogDelete: false,
      dialog: false,
      dialogMap: false,
      dialogEdit: false,
      dialogArea: false,
      dialogPlace: false,
      dialogRepresentant: false,
      problem: false,
      editMap: false,
      step: 1,
      establishments: [],
      places: [],
      areas: [],
      representants: [],
      defaultPlaces: [],
      defaultareas: [],
      defaultRepresentants: [],
      editedIndex: -1,
      headers: [
        {
          text: 'Nombre',
          value: 'nombre',
          align: 'start'
        },
        {
          text: 'Administrador',
          value: 'administrador'
        },
        {
          text: 'Representante',
          value: 'representante',
          align: 'center'
        },
        {
          text: 'Correo',
          value: 'email'
        },
        {
          text: 'Nacionalidad / Pueblo',
          value: 'nacionalidad',
          align: 'center'
        },
        {
          text: 'Registro',
          value: 'registro'
        },
        {
          text: 'LUAF',
          value: 'LUAF'
        },
        {
          text: 'Página web',
          value: 'web',
          align: 'center'
        },
        {
          text: 'Teléfono',
          value: 'telefono'
        },
        {
          text: 'Lugar',
          value: 'lugar',
          align: 'center'
        },
        {
          text: 'Área Protegida',
          value: 'areaProtegida',
          align: 'center'
        },
        {
          text: 'Estado',
          value: 'estado',
          align: 'center',
          sortable: false
        },
        {
          text: 'Acciones',
          value: 'actions',
          align: 'center',
          sortable: false
        }
      ],
      editedRepresentant: {
        _id: '',
        nombre: '',
        apellido: '',
        cedula: '',
        email: '',
        telefono: '',
        direccion: '',
        usuario: {
          nombre: ''
        }
      },
      defaultRepresentant: {
        _id: '',
        nombre: '',
        apellido: '',
        cedula: '',
        email: '',
        telefono: '',
        direccion: '',
        usuario: {
          nombre: ''
        }
      },
      editedArea: {
        _id: '',
        nombre: '',
        tipo: ''
      },
      defaultArea: {
        _id: '',
        nombre: '',
        tipo: ''
      },
      editedPlace: {
        _id: '',
        ciudad: '',
        parroquia: '',
        estado: '',
        canton: 'Riobamba',
        provincia: 'Chimborazo',
        lat: -1.6519177088279544,
        lng: -78.64296128376385
      },
      defaultPlace: {
        _id: '',
        ciudad: '',
        parroquia: '',
        estado: '',
        canton: 'Riobamba',
        provincia: 'Chimborazo',
        lat: -1.6519177088279544,
        lng: -78.64296128376385
      },
      coordinates: {
        lat: 0,
        lng: 0
      },
      editedItem: {
        _id: '',
        nombre: '',
        administrador: '',
        representante: {},
        nacionalidad: '',
        registro: '',
        LUAF: '',
        email: '',
        web: '',
        telefono: '',
        lugar: {},
        areaProtegida: {},
        estado: false
      },
      defaultItem: {
        nombre: '',
        administrador: '',
        representante: {},
        nacionalidad: '',
        registro: '',
        LUAF: '',
        email: '',
        web: '',
        telefono: '',
        lugar: {},
        areaProtegida: {},
        estado: false
      },
      disable: false,
      fieldRules: [
        v => !!v || 'Campo necesario',
        v => (v && v.length >= 3) || 'Debe tener mas de 3 letras'
      ],
      numberRules: [
        v => !!v || 'Campo necesario',
        v => Number.isInteger(parseInt(v)) || 'Solo se permiten números'
      ]
    }
  },
  methods: {
    selectItemEdit(critery, item) {
      if (critery === 'place') {
        this.places.splice(this.places.indexOf(item), 1)
        this.places.push(this.editedItem.lugar)
        this.editedItem.lugar = item
      } else {
        if (critery === 'representant') {
          this.representants.splice(this.representants.indexOf(item), 1)
          if (this.editedItem.representante) {
            this.representants.push(this.editedItem.representante)
          }
          this.editedItem.representante = item
        } else {
          this.areas.splice(this.areas.indexOf(item), 1)
          if (this.editedItem.areaProtegida) {
            this.areas.push(this.editedItem.areaProtegida)
          }
          this.editedItem.areaProtegida = item
        }
      }
    },

    showObject(critery, item) {
      this.editedItem = item
      if (critery === 'place') {
        this.dialogPlace = true
      } else {
        if (critery === 'representant') {
          this.dialogRepresentant = true
        } else {
          this.dialogArea = true
        }
      }
    },

    validateForm(item) {
      if (item === 'establishment') {
        if (this.$refs.formSave.validate()) {
          this.editedItem.lugar = this.editedPlace._id
          if (this.editedRepresentant)
            this.editedItem.representante = this.editedRepresentant._id
          if (this.editedArea) this.editedItem.areaProtegida = this.editedArea._id
          this.save()
        }
      } else {
        if (item === 'place') {
          if (this.$refs.formPlace.validate()) {
            this.step = 2
          }
        }
      }
    },

    async getEstablishments() {
      this.loading = true
      this.establishments = []
      await this.$http
        .get('/api/establecimientos')
        .then(res => {
          this.loading = false
          this.establishments = res.data.data
        })
        .catch(error => {
          this.loading = false
          swalError(
            error.body.err != undefined
              ? error.body.err.message
              : 'Ha ocurrido un error, por favor inténtelo de nuevo más tarde'
          )
        })
    },

    async getPlaces() {
      this.loading = true
      await this.$http
        .get('/api/lugares/noAsignados')
        .then(res => {
          this.loading = false
          this.defaultPlaces = res.data.data
          this.places = this.defaultPlaces.map(v => {
            return v
          })
        })
        .catch(error => {
          this.loading = false
          swalError(
            error.body.err != undefined
              ? error.body.err.message
              : 'Ha ocurrido un error, por favor inténtelo de nuevo más tarde'
          )
        })
    },

    async getAreas() {
      this.loading = true
      await this.$http
        .get('/api/areasProtegidas/noAsignados')
        .then(res => {
          this.loading = false
          this.defaultAreas = res.data.data
          this.areas = this.defaultAreas.map(v => {
            return v
          })
        })
        .catch(error => {
          this.loading = false
          swalError(
            error.body.err != undefined
              ? error.body.err.message
              : 'Ha ocurrido un error, por favor inténtelo de nuevo más tarde'
          )
        })
    },

    async getRepresentants() {
      this.loading = true
      await this.$http
        .get('/api/representantes/noAsignados')
        .then(res => {
          this.loading = false
          this.defaultRepresentants = res.data.data
          this.representants = this.defaultRepresentants.map(v => {
            return v
          })
        })
        .catch(error => {
          this.loading = false
          swalError(
            error.body.err != undefined
              ? error.body.err.message
              : 'Ha ocurrido un error, por favor inténtelo de nuevo más tarde'
          )
        })
    },

    deleteItem(item) {
      this.editedIndex = this.establishments.indexOf(item)
      this.editedItem = item
      this.dialogDelete = true
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    async deleteItemConfirm() {
      await this.removeEstablishment()
      if (!this.problem) {
        this.establishments.splice(this.editedIndex, 1)
      }
      this.closeDelete()
      this.problem = false
    },

    editItem(item) {
      this.editedIndex = this.establishments.indexOf(item)
      this.editedItem = Object.assign({}, item)
      if (this.editedItem.representante) {
       this.editedRepresentant = Object.assign({}, this.editedItem.representante) 
      }
      this.dialogEdit = true
    },

    close() {
      if (this.dialog) {
        this.$refs.formPlace.resetValidation()
        this.$refs.formSave.resetValidation()
      }
      this.changed = false
      this.dialog = false
      this.disable = false
      this.dialogEdit = false
      this.searchArea = ''
      this.searchPlace = ''
      this.searchRepresentant = ''
      this.step = 1
      this.places = this.defaultPlaces.map(v => {
        return v
      })
      this.representants = this.defaultRepresentants.map(v => {
        return v
      })
      this.areas = this.defaultAreas.map(v => {
        return v
      })
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
        this.editedPlace = Object.assign({}, this.defaultPlace)
        this.editedArea = Object.assign({}, this.defaultArea)
        this.editedRepresentant = Object.assign({}, this.defaultRepresentant)
      })
    },

    async save() {
      if (this.editedIndex > -1) {
        await this.changeEstablishment()
        if (!this.problem) {
          Object.assign(this.establishments[this.editedIndex], this.editedItem)
          this.close()
          this.getPlaces()
          this.getAreas()
          this.getRepresentants()
        }
      } else {
        await this.middlewarePlace()
        if (!this.problem) {
          await this.addEstablishment()
        }
        if (!this.problem) {
          this.establishments.push(this.editedItem)
          this.close()
          this.getPlaces()
          this.getAreas()
          this.getRepresentants()
        }
      }
      this.problem = false
    },

    selectPlace(item) {
      this.searchPlace = item.parroquia
      this.editedPlace = item
      this.disable = true
    },

    selectArea(item) {
      this.searchArea = item.nombre
      this.editedArea = item
    },

    selectRepresentant(item) {
      this.editedRepresentant = item
      this.searchRepresentant = item.nombre
    },

    clear(critery) {
      if (critery === 'place') {
        this.editedPlace = this.defaultPlace
        this.disable = false
        this.searchPlace = ''
        this.$refs.formPlace.resetValidation()
      } else {
        if (critery === 'representant') {
          this.editedRepresentant = this.defaultRepresentant
          this.searchRepresentant = ''
        } else {
          this.editedArea = this.defaultArea
          this.searchArea = ''
        }
      }
    },

    showMap(data, item) {
      this.editMap = data
      if (item) {
        this.coordinates.lat = item.lat
        this.coordinates.lng = item.lng
      } else {
        this.coordinates.lat = this.editedPlace.lat
        this.coordinates.lng = this.editedPlace.lng
      }
      this.dialogMap = true
    },

    closeMap() {
      this.coordinates.lat = 0
      this.coordinates.lng = 0
      this.dialogMap = false
    },

    closeObject(critery) {
      if (critery === 'place') {
        this.dialogPlace = false
      } else {
        if (critery === 'representant') {
          this.dialogRepresentant = false
        } else {
          this.dialogArea = false
        }
      }
      if (!this.dialogEdit) {
        this.editedItem = Object.assign({}, this.defaultItem)
      }
    },

    saveCoordinates(data) {
      this.editedPlace.lat = data.lat
      this.editedPlace.lng = data.lng
      this.dialogMap = false
    },

    async middlewarePlace() {
      if (!this.editedPlace._id) {
        this.loading = true
        swalLoading('Ingresando Lugar')
        try {
          await this.$http.post('/api/lugar', this.editedPlace).then(async res => {
            this.loading = false
            swalConfirm('Lugar nuevo ingresado')
            this.problem = false
            this.editedPlace = res.data.data
          })
        } catch (error) {
          this.loading = false
          swalError(
            error.body.err != undefined
              ? error.body.err.message
              : 'Ha ocurrido un error, por favor inténtelo de nuevo más tarde'
          )
          this.problem = true
        }
      } else {
        this.problem = false
      }
    },

    async addEstablishment() {
      this.loading = true
      swalLoading('Ingresando Establecimiento')
      if (!this.editedItem.areaProtegida) delete this.editedItem.areaProtegida
      if (!this.editedItem.representante) delete this.editedItem.representante
      try {
        await this.$http.post('/api/establecimiento', this.editedItem).then(async res => {
          this.loading = false
          swalConfirm('Establecimiento nuevo ingresado')
          this.problem = false
          this.editedItem = res.data.data
          console.log(res.data.data)
        })
      } catch (error) {
        this.loading = false
        swalError(
          error.body.err != undefined
            ? error.body.err.message
            : 'Ha ocurrido un error, por favor inténtelo de nuevo más tarde'
        )
        this.problem = true
      }
    },

    async removeEstablishment() {
      this.loading = true
      swalLoading('Eliminando establecimiento')
      try {
        await this.$http
          .delete(`/api/establecimiento/${this.editedItem._id}`)
          .then(() => {
            this.loading = false
            swalConfirm('Establecimiento Eliminado')
          })
        this.problem = false
      } catch (error) {
        this.loading = false
        swalError(
          error.body.err != undefined
            ? error.body.err.message
            : 'Ha ocurrido un error, por favor inténtelo de nuevo más tarde'
        )
        this.problem = true
      }
    },

    async changeEstablishment() {
      this.loading = true
      swalLoading('Editando establecimiento')
      var establishmentEdit =  Object.assign({}, this.editedItem)
      if (establishmentEdit.areaProtegida) {
        establishmentEdit.areaProtegida = establishmentEdit.areaProtegida._id
      } else {
        delete establishmentEdit.areaProtegida
      }
      if (establishmentEdit.representante) {
        if (this.editedRepresentant === this.editedItem.representante)
        {
          delete establishmentEdit.representante
        } else {
          establishmentEdit.representante = establishmentEdit.representante._id
        }
      } else {
        delete establishmentEdit.representante
      }

      try {
        await this.$http
          .put(`/api/establecimiento/${establishmentEdit._id}`, establishmentEdit)
          .then(async () => {
            this.loading = false
            swalConfirm('Establecimiento editado')
            this.problem = false
          })
      } catch (error) {
        this.loading = false
        swalError(
          error.body.err != undefined
            ? error.body.err.message
            : 'Ha ocurrido un error, por favor inténtelo de nuevo más tarde'
        )
        this.problem = true
      }
    }
  },
  async created() {
    await this.getEstablishments()
    await this.getPlaces()
    await this.getAreas()
    await this.getRepresentants()
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? 'Crear un Establecimiento'
        : 'Editar un Establecimiento'
    },
    editable() {
      return this.step >= 2 ? true : false
    }
  },
  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogEdit(val) {
      val || this.close()
    },
    dialogMap(val) {
      val || this.closeMap()
    },
    dialogRepresentant(val) {
      val || this.closeObject('representant')
    },
    dialogPlace(val) {
      val || this.closeObject('place')
    },
    dialogArea(val) {
      val || this.closeObject('area')
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
    activator(val) {
      if (!val) {
        this.getEstablishments()
      }
    }
  }
}
</script>