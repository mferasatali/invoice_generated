<template>
  <v-container>
    <div class="mt-10">
      <h1 class="text-center text-primary">Generated Invoices POC</h1>

      <v-row class="d-flex align-center mt-4">
        <v-col class="d-flex flex-column mt-5">
          <h3 class="text-primary">Total Invoices:</h3>
          <p class="text-black font-weight-bold">{{ totalInvoices }}</p>
        </v-col>
        <v-col class="d-flex flex-column mt-5">
          <h3 class="text-primary">Flag Invoices:</h3>
          <p class="text-warning font-weight-bold">{{ failureCount }}</p>
        </v-col>
        <v-col class="d-flex flex-column mt-5">
          <h3 class="text-primary">Generated Invoices:</h3>
          <p class="text-success font-weight-bold">{{ successCount }}</p>
        </v-col>
        <v-col class="d-flex flex-column mt-5">
          <v-file-input
            v-model="file"
            @update:model-value="uploadFile"
            density="compact"
            label="Upload File"
            :loading="isUploadFile"
            variant="outlined"
          ></v-file-input>
        </v-col>
      </v-row>
      <div class="mt-6">
        <v-row align="center">
          <v-col cols="5">
            <label class="font-weight-bold text-info"> Search Here:</label>
            <v-text-field
              v-model="textField"
              class="mt-2"
              placeholder="Search by Customer Name, Invoices or Customer ID"
              variant="outlined"
              color="primary"
            >
            </v-text-field>
          </v-col>
          <v-col cols="7">
            <div class="d-flex align-center ga-3 justify-end flex-wrap">
              <v-btn
                variant="tonal"
                color="primary"
                width="13rem"
                class="text-capitalize"
                @click="updateTextField"
              >
                Search
              </v-btn>
              <v-btn
                variant="tonal"
                color="danger"
                width="13rem"
                class="text-capitalize"
                :loading="isReset"
                @click="deleteAllData"
              >
                Reset
              </v-btn>
              <v-btn
                variant="tonal"
                color="secondary"
                width="13rem"
                :loading="isSendToBill"
                class="text-capitalize"
                @click="generateInvoice"
              >
                Send to Bill.com
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </div>
    </div>
    <div class="mt-3">
      <v-data-table
        v-model="selected"
        :items="dataItems.value.customers"
        :headers="headers"
        hide-default-footer
        disable-pagination
        item-value="customerId"
        show-select
      ></v-data-table>
      <div class="d-flex align-start base-card mt-1 bg-white">
        <v-pagination
          v-model:currentPage="currentPage"
          :length="dataItems.pagination.totalPages"
          :total-visible="6"
          @update:modelValue="onPageChange"
        ></v-pagination>
      </div>
    </div>
  </v-container>
</template>
<script setup>
import { onMounted, ref } from "vue";
import {
  deleteInvoice,
  getItems,
  uploadFileData,
  generateInvoiceData,
} from "@/apis/apis";

const file = ref(null);
const textField = ref(null);
const dataItems = ref({
  customers: [],
  pagination: {
    currentPage: 1,
    totalPages: 2,
    totalCustomers: 58,
    limit: 50,
  },
});
const isReset = ref(false);
const isSendToBill = ref(false);

onMounted(async () => {
  const response = await getItems({ page: 1, limit: 50 });
  if (response) {
    dataItems.value.customers = response.customers;
    dataItems.value.pagination = response.pagination;
  }
});

const currentPage = ref(1);
const limit = ref(50);

const selected = ref([]);
const headers = [
  { title: "Customer Id", key: "customerId" },
  { title: "Customer Name", key: "customerName" },
  { title: "Invoice Number", key: "invoiceNumber" },
  { title: "Invoice Date", key: "invoiceDate" },
  { title: "Amount", key: "total" },
];

const onPageChange = async (page) => {
  dataItems.value = await getItems({ page, limit: 50 });
};
const isUploadFile = ref(false);

const updateTextField = async () => {
  if (textField.value === null || textField.value === "") {
    alert("Please enter search text");
    return;
  }
  const response = await getItems({
    page: 1,
    limit: 50,
    qstr: textField.value,
  });

  if (response) {
    dataItems.value.customers = response.customers;
    dataItems.value.pagination = response.pagination;
  }
};
const totalInvoices = ref(0);

const uploadFile = async (e) => {
  isUploadFile.value = true;
  if (e) {
    const data = await uploadFileData(e);
    if (data?.totalInvoices) {
      totalInvoices.value = data.totalInvoices;
      await getItemsData();
    }
  }
  isUploadFile.value = false;
};
const successCount = ref(0);
const failureCount = ref(0);

const generateInvoice = async () => {
  if (selected.value.length === 0) {
    alert("Please select atleast one invoice to generate");
    return;
  }
  isSendToBill.value = true;
  const data = await generateInvoiceData(selected.value);
  if (data) {
    successCount.value = data.successCount;
    failureCount.value = data.failureCount;
  }
  isSendToBill.value = false;
};

const deleteAllData = async () => {
  isReset.value = true;
  const data = await deleteInvoice();
  if (data) {
    successCount.value = 0;
    failureCount.value = 0;
    selected.value = [];
    await getItemsData();
  }
  isReset.value = false;
};

const getItemsData = async () => {
  const response = await getItems({ page: 1, limit: 50 });
  if (response) {
    dataItems.value.customers = response.customers;
    dataItems.value.pagination = response.pagination;
  }
};
</script>
