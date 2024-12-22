<template>
  <v-container>
    <div class="mt-10">
      <h2 class="text-center text-black">Generated Invoices POC</h2>

      <v-row class="d-flex align-center mt-4">
        <v-col class="d-flex flex-column mt-5">
          <v-card
            class="pa-7 radius-10 card"
            color="step-segment"
            min-height="110px"
          >
            <h3 class="text-black">Total Invoices:</h3>
            <p class="text-primary font-weight-bold">{{ totalInvoices }}</p>
          </v-card>
        </v-col>
        <v-col class="d-flex flex-column mt-5">
          <v-card
            class="pa-7 radius-10 card"
            color="step-segment"
            min-height="110px"
          >
            <h3 class="text-black">Flag Invoices:</h3>
            <p class="text-red font-weight-bold">{{ failureCount }}</p>
          </v-card>
        </v-col>
        <v-col class="d-flex flex-column mt-5">
          <v-card
            class="pa-7 radius-10 card"
            color="step-segment"
            min-height="110px"
          >
            <h3 class="text-black">Generated Invoices:</h3>
            <p class="text-green font-weight-bold">{{ successCount }}</p>
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-card
            class="pa-6 d-flex align-center justify-center radius-10 card cursor-pointer"
            color="step-segment"
            min-height="100px"
            @click="triggerFileInput"
          >
            <!-- Hidden v-file-input component -->
            <v-file-input
              v-model="file"
              @update:model-value="uploadFile"
              density="compact"
              accept="text/plain, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              :loading="isUploadFile"
              variant="outlined"
              label="Upload File"
              class="d-none"
            ></v-file-input>

            <!-- Drag and Drop area -->
            <div
              class="dropzone"
              @dragover.prevent
              @drop="onDrop"
              @dragenter.prevent
              @dragleave.prevent
            >
              <v-icon large>mdi-cloud-upload</v-icon>
              <span class="ml-2"
                >Drag and drop your file here, or click to browse</span
              >
            </div>
          </v-card>
        </v-col>
      </v-row>
      <div class="mt-6">
        <v-row align="center">
          <v-col cols="5">
            <label class="font-weight-bold text-black">Search Here:</label>
            <v-text-field
              v-model="textField"
              class="mt-2"
              placeholder="Search by Customer Name, Invoices or Customer ID"
              variant="outlined"
              color="primary"
            ></v-text-field>
          </v-col>
          <v-col cols="7">
            <div class="d-flex align-center ga-3 justify-end flex-wrap">
              <v-btn
                color="primary"
                width="13rem"
                class="text-capitalize card"
                @click="updateTextField"
              >
                Search
              </v-btn>
              <v-btn
                color="danger"
                width="13rem"
                class="text-capitalize card"
                :loading="isReset"
                @click="deleteAllData"
              >
                Reset
              </v-btn>
              <v-btn
                color="green"
                width="13rem"
                :loading="isSendToBill"
                class="text-capitalize card"
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
      {{ customersData.length }}asda
      <v-data-table
        v-model="selected"
        :items="customersData"
        :headers="headers"
        hide-default-footer
        disable-pagination
        item-value="customerId"
        show-select
      ></v-data-table>
      <div class="d-flex justify-center mt-5">
        <v-btn
          v-if="!isShowAll && dataItems.customers.length > 10"
          variant="text"
          color="primary"
          @click="isShowAll = true"
        >
          <v-icon class="mr-2"> mdi-refresh </v-icon>
          Show All
        </v-btn>
      </div>
    </div>
  </v-container>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
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
  pagination: { currentPage: 1, totalPages: 1, totalCustomers: 0, limit: 50 },
});
const isReset = ref(false);
const isSendToBill = ref(false);
const isShowAll = ref(false);
onMounted(async () => {
  const response = await getItems({ page: 1, limit: 500 });
  if (response) {
    dataItems.value.customers = response.customers;
    dataItems.value.pagination = response.pagination;
  }
});

const triggerFileInput = () => {
  document.querySelector('input[type="file"]').click();
};

const currentPage = ref(1);
const selected = ref([]);
const headers = [
  { title: "Customer Id", key: "customerId" },
  { title: "Customer Name", key: "customerName" },
  { title: "Invoice Number", key: "invoiceNumber" },
  { title: "IC", key: "IC" },
  { title: "Type", key: "type" },
  { title: "Apply To", key: "applyTo" },
  { title: "Transaction Amount", key: "trxAmt" },
  { title: "Transaction Tax", key: "trxTax" },
  { title: "Total", key: "total" },
];

const onPageChange = async (page) => {
  const response = await getItems({ page, limit: 500 });
  if (response) {
    dataItems.value.customers = response.customers ?? [];
    dataItems.value.pagination = response.pagination ?? {
      currentPage: 1,
      totalPages: 1,
      totalCustomers: 0,
      limit: 50,
    };
  }
};

const customersData = computed(() => {
  if (isShowAll.value) {
    return dataItems.value.customers;
  } else {
    return dataItems.value.customers.slice(0, 10);
  }
});
const isUploadFile = ref(false);

const updateTextField = async () => {
  if (!textField.value) {
    alert("Please enter search text");
    return;
  }
  const response = await getItems({
    page: 1,
    limit: 50,
    qstr: textField.value,
  });
  if (response) {
    dataItems.value.customers = response.customers ?? [];
    dataItems.value.pagination = response.pagination ?? {
      currentPage: 1,
      totalPages: 1,
      totalCustomers: 0,
      limit: 50,
    };
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
  if (!selected.value.length) {
    alert("Please select at least one invoice to generate");
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
  const response = await getItems({ page: 1, limit: 500 });
  if (response) {
    dataItems.value.customers = response.customers ?? [];
    dataItems.value.pagination = response.pagination ?? {
      currentPage: 1,
      totalPages: 1,
      totalCustomers: 0,
      limit: 50,
    };
  }
};

const onDrop = (event) => {
  const droppedFile = event.dataTransfer.files[0];
  if (droppedFile) {
    file.value = droppedFile;
    uploadFile(droppedFile);
  }
};
</script>

<style lang="scss">
.card {
  border-radius: 12px !important;
}
</style>
