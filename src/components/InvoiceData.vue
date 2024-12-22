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
        :items="dataItems.customers"
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
  customers: [
    {
      _id: "676842b10ab555ed623fbee9",
      customerId: "062060",
      customerName: "ADVANCE INDUSTRIAL",
      invoiceDate: "11/01/2024",
      IC: "I",
      invoiceNumber: "*11240056",
      type: "B",
      applyTo: "",
      trxAmt: "464.40",
      trxTax: "0.00",
      total: "464.40",
      __v: 0,
    },
    {
      _id: "676842b10ab555ed623fbeda",
      customerId: "059066",
      customerName: "ADVANCE INDUSTRIAL",
      invoiceDate: "11/01/2024",
      IC: "I",
      invoiceNumber: "*11240051",
      type: "B",
      applyTo: "",
      trxAmt: "464.40",
      trxTax: "0.00",
      total: "464.40",
      __v: 0,
    },
    {
      _id: "676842b10ab555ed623fbea7",
      customerId: "052047",
      customerName: "AIKEN VA CLINIC",
      invoiceDate: "11/01/2024",
      IC: "I",
      invoiceNumber: "*11240034",
      type: "B",
      applyTo: "",
      trxAmt: "3,646.49",
      trxTax: "0.00",
      total: "3,646.49",
      __v: 0,
    },
    {
      _id: "676842b10ab555ed623fbee6",
      customerId: "062054",
      customerName: "AMERICAN TIRE DISTRIBUTORS",
      invoiceDate: "11/01/2024",
      IC: "I",
      invoiceNumber: "11240055",
      type: "B",
      applyTo: "",
      trxAmt: "455.05",
      trxTax: "0.00",
      total: "455.05",
      __v: 0,
    },
    {
      _id: "676842b10ab555ed623fbebc",
      customerId: "057022",
      customerName: "AMERICAN WELDING & GAS",
      invoiceDate: "11/01/2024",
      IC: "I",
      invoiceNumber: "*11240041",
      type: "B",
      applyTo: "",
      trxAmt: "250.00",
      trxTax: "0.00",
      total: "250.00",
      __v: 0,
    },
    {
      _id: "676842b10ab555ed623fbe77",
      customerId: "040031",
      customerName: "AUGUSTA SASH AND DOOR",
      invoiceDate: "11/01/2024",
      IC: "I",
      invoiceNumber: "11240018",
      type: "B",
      applyTo: "",
      trxAmt: "515.04",
      trxTax: "0.00",
      total: "515.04",
      __v: 0,
    },
    {
      _id: "676842b10ab555ed623fbe95",
      customerId: "052032",
      customerName: "BARRETT WINDOW & DOOR",
      invoiceDate: "11/01/2024",
      IC: "I",
      invoiceNumber: "11240028",
      type: "B",
      applyTo: "",
      trxAmt: "237.81",
      trxTax: "0.00",
      total: "237.81",
      __v: 0,
    },
    {
      _id: "676842b10ab555ed623fbe65",
      customerId: "009069",
      customerName: "BERKSHIRE HATHAWAY - AIKEN",
      invoiceDate: "11/01/2024",
      IC: "I",
      invoiceNumber: "*11240012",
      type: "B",
      applyTo: "",
      trxAmt: "310.20",
      trxTax: "0.00",
      total: "310.20",
      __v: 0,
    },
    {
      _id: "676842b10ab555ed623fbe86",
      customerId: "052014",
      customerName: "CAROLINA REAL ESTATE",
      invoiceDate: "11/01/2024",
      IC: "I",
      invoiceNumber: "11240023",
      type: "B",
      applyTo: "",
      trxAmt: "230.08",
      trxTax: "0.00",
      total: "230.08",
      __v: 0,
    },
    {
      _id: "676842b10ab555ed623fbee3",
      customerId: "062022",
      customerName: "CENTER FOR OCCUPATIONAL HEALTH",
      invoiceDate: "11/01/2024",
      IC: "I",
      invoiceNumber: "*11240054",
      type: "B",
      applyTo: "",
      trxAmt: "710.24",
      trxTax: "0.00",
      total: "710.24",
      __v: 0,
    },
    {
      _id: "676842b10ab555ed623fbec5",
      customerId: "058095",
      customerName: "CHICK FIL A- AUGUSTA EXCHANGE",
      invoiceDate: "11/01/2024",
      IC: "I",
      invoiceNumber: "11240044",
      type: "B",
      applyTo: "",
      trxAmt: "1,056.00",
      trxTax: "0.00",
      total: "1,056.00",
      __v: 0,
    },
    {
      _id: "676842b10ab555ed623fbe5f",
      customerId: "009064",
      customerName: "COLON & RECTAL SURGERY",
      invoiceDate: "11/01/2024",
      IC: "I",
      invoiceNumber: "*11240010",
      type: "B",
      applyTo: "",
      trxAmt: "316.99",
      trxTax: "0.00",
      total: "316.99",
      __v: 0,
    },
    {
      _id: "676842b10ab555ed623fbe8c",
      customerId: "052025",
      customerName: "COVENANT PRESBYTERIAN CHURCH",
      invoiceDate: "11/01/2024",
      IC: "I",
      invoiceNumber: "11240025",
      type: "B",
      applyTo: "",
      trxAmt: "1,082.00",
      trxTax: "0.00",
      total: "1,082.00",
      __v: 0,
    },
    {
      _id: "676842b10ab555ed623fbe98",
      customerId: "052035",
      customerName: "CSRA TESTING AND ENGINEERING",
      invoiceDate: "11/01/2024",
      IC: "I",
      invoiceNumber: "11240029",
      type: "B",
      applyTo: "",
      trxAmt: "297.91",
      trxTax: "0.00",
      total: "297.91",
      __v: 0,
    },
    {
      _id: "676842b10ab555ed623fbed4",
      customerId: "059064",
      customerName: "CUSTOM SADDLERY",
      invoiceDate: "11/01/2024",
      IC: "I",
      invoiceNumber: "*11240049",
      type: "B",
      applyTo: "",
      trxAmt: "309.30",
      trxTax: "0.00",
      total: "309.30",
      __v: 0,
    },
    {
      _id: "676842b10ab555ed623fbebf",
      customerId: "058092",
      customerName: "EDGEFIELD COUNTY HEALTHCARE",
      invoiceDate: "11/01/2024",
      IC: "I",
      invoiceNumber: "*11240042",
      type: "B",
      applyTo: "",
      trxAmt: "646.78",
      trxTax: "0.00",
      total: "646.78",
      __v: 0,
    },
    {
      _id: "676842b10ab555ed623fbe68",
      customerId: "009070",
      customerName: "ENCOMPASS HEALTH-HOME HEALTH",
      invoiceDate: "11/01/2024",
      IC: "I",
      invoiceNumber: "*11240013",
      type: "B",
      applyTo: "",
      trxAmt: "286.78",
      trxTax: "0.00",
      total: "286.78",
      __v: 0,
    },
    {
      _id: "676842b10ab555ed623fbe6b",
      customerId: "009071",
      customerName: "ENCOMPASS HEALTH-HOSPICE",
      invoiceDate: "11/01/2024",
      IC: "I",
      invoiceNumber: "*11240014",
      type: "B",
      applyTo: "",
      trxAmt: "280.74",
      trxTax: "0.00",
      total: "280.74",
      __v: 0,
    },
    {
      _id: "676842b10ab555ed623fbe6e",
      customerId: "009072",
      customerName: "ENERGREEN AMERICA",
      invoiceDate: "11/01/2024",
      IC: "I",
      invoiceNumber: "*11240015",
      type: "B",
      applyTo: "",
      trxAmt: "448.51",
      trxTax: "0.00",
      total: "448.51",
      __v: 0,
    },
    {
      _id: "676842b10ab555ed623fbe7a",
      customerId: "040034",
      customerName: "GEXPRO",
      invoiceDate: "11/01/2024",
      IC: "I",
      invoiceNumber: "*11240019",
      type: "B",
      applyTo: "",
      trxAmt: "405.00",
      trxTax: "0.00",
      total: "405.00",
      __v: 0,
    },
    {
      _id: "676842b10ab555ed623fbe62",
      customerId: "009068",
      customerName: "HOUNDSLAKE COUNTRY CLUB",
      invoiceDate: "11/01/2024",
      IC: "I",
      invoiceNumber: "*11240011",
      type: "B",
      applyTo: "",
      trxAmt: "325.00",
      trxTax: "0.00",
      total: "325.00",
      __v: 0,
    },
    {
      _id: "676842b10ab555ed623fbe50",
      customerId: "009038",
      customerName: "KENDRICK PAINT & BODY -",
      invoiceDate: "11/01/2024",
      IC: "I",
      invoiceNumber: "11240005",
      type: "B",
      applyTo: "",
      trxAmt: "300.45",
      trxTax: "0.00",
      total: "300.45",
      __v: 0,
    },
    {
      _id: "676842b10ab555ed623fbe4d",
      customerId: "009034",
      customerName: "KENDRICK PAINT & BODY-RICHLAND",
      invoiceDate: "11/01/2024",
      IC: "I",
      invoiceNumber: "11240004",
      type: "B",
      applyTo: "",
      trxAmt: "309.54",
      trxTax: "0.00",
      total: "309.54",
      __v: 0,
    },
    {
      _id: "676842b10ab555ed623fbeec",
      customerId: "063010",
      customerName: "KENNETH SHULER",
      invoiceDate: "11/01/2024",
      IC: "I",
      invoiceNumber: "*11240057",
      type: "B",
      applyTo: "",
      trxAmt: "976.35",
      trxTax: "0.00",
      total: "976.35",
      __v: 0,
    },
    {
      _id: "676842b10ab555ed623fbeb9",
      customerId: "057012",
      customerName: "KUHLKE CONSTRUCTION",
      invoiceDate: "11/01/2024",
      IC: "I",
      invoiceNumber: "*11240040",
      type: "B",
      applyTo: "",
      trxAmt: "228.02",
      trxTax: "0.00",
      total: "228.02",
      __v: 0,
    },
    {
      _id: "676842b10ab555ed623fbe56",
      customerId: "009050",
      customerName: "MANER BUILDER'S SUPPLY CO",
      invoiceDate: "11/01/2024",
      IC: "I",
      invoiceNumber: "*11240007",
      type: "B",
      applyTo: "",
      trxAmt: "293.36",
      trxTax: "0.00",
      total: "293.36",
      __v: 0,
    },
    {
      _id: "676842b10ab555ed623fbed7",
      customerId: "059065",
      customerName: "MASSEY SERVICES - WARRENVILLE",
      invoiceDate: "11/01/2024",
      IC: "I",
      invoiceNumber: "*11240050",
      type: "B",
      applyTo: "",
      trxAmt: "374.13",
      trxTax: "0.00",
      total: "374.13",
      __v: 0,
    },
    {
      _id: "676842b10ab555ed623fbeaa",
      customerId: "052048",
      customerName: "MEDNOW URGENT CARE",
      invoiceDate: "11/01/2024",
      IC: "I",
      invoiceNumber: "11240035",
      type: "B",
      applyTo: "",
      trxAmt: "949.00",
      trxTax: "0.00",
      total: "949.00",
      __v: 0,
    },
    {
      _id: "676842b10ab555ed623fbead",
      customerId: "052049",
      customerName: "MEDNOW URGENT CARE",
      invoiceDate: "11/01/2024",
      IC: "I",
      invoiceNumber: "11240036",
      type: "B",
      applyTo: "",
      trxAmt: "735.00",
      trxTax: "0.00",
      total: "735.00",
      __v: 0,
    },
    {
      _id: "676842b10ab555ed623fbe74",
      customerId: "040020",
      customerName: "MENARDI",
      invoiceDate: "11/01/2024",
      IC: "I",
      invoiceNumber: "*11240017",
      type: "B",
      applyTo: "",
      trxAmt: "2,977.71",
      trxTax: "0.00",
      total: "2,977.71",
      __v: 0,
    },
    {
      _id: "676842b10ab555ed623fbe7d",
      customerId: "051066",
      customerName: "MORGAN THERMAL CERAMICS",
      invoiceDate: "11/01/2024",
      IC: "I",
      invoiceNumber: "11240020",
      type: "B",
      applyTo: "",
      trxAmt: "13,100.00",
      trxTax: "0.00",
      total: "13,100.00",
      __v: 0,
    },
    {
      _id: "676842b10ab555ed623fbece",
      customerId: "059055",
      customerName: "MOUNT VINTAGE HOA",
      invoiceDate: "11/01/2024",
      IC: "I",
      invoiceNumber: "*11240047",
      type: "B",
      applyTo: "",
      trxAmt: "1,045.00",
      trxTax: "0.00",
      total: "1,045.00",
      __v: 0,
    },
    {
      _id: "676842b10ab555ed623fbecb",
      customerId: "059054",
      customerName: "MT VINTAGE GOLF CLUB",
      invoiceDate: "11/01/2024",
      IC: "I",
      invoiceNumber: "*11240046",
      type: "B",
      applyTo: "",
      trxAmt: "1,261.48",
      trxTax: "0.00",
      total: "1,261.48",
      __v: 0,
    },
    {
      _id: "676842b10ab555ed623fbe71",
      customerId: "040017",
      customerName: "NOLAND",
      invoiceDate: "11/01/2024",
      IC: "I",
      invoiceNumber: "*11240016",
      type: "B",
      applyTo: "",
      trxAmt: "222.40",
      trxTax: "0.00",
      total: "222.40",
      __v: 0,
    },
    {
      _id: "676842b10ab555ed623fbe83",
      customerId: "052010",
      customerName: "ORANO, INC.",
      invoiceDate: "11/01/2024",
      IC: "I",
      invoiceNumber: "*11240022",
      type: "B",
      applyTo: "",
      trxAmt: "297.57",
      trxTax: "0.00",
      total: "297.57",
      __v: 0,
    },
    {
      _id: "676842b10ab555ed623fbe89",
      customerId: "052021",
      customerName: "OUR REDEEMER LUTHERAN CHURCH",
      invoiceDate: "11/01/2024",
      IC: "I",
      invoiceNumber: "11240024",
      type: "B",
      applyTo: "",
      trxAmt: "964.02",
      trxTax: "0.00",
      total: "964.02",
      __v: 0,
    },
    {
      _id: "676842b10ab555ed623fbeb6",
      customerId: "057010",
      customerName: "PDGA",
      invoiceDate: "11/01/2024",
      IC: "I",
      invoiceNumber: "*11240039",
      type: "B",
      applyTo: "",
      trxAmt: "211.00",
      trxTax: "0.00",
      total: "211.00",
      __v: 0,
    },
    {
      _id: "676842b10ab555ed623fbeb0",
      customerId: "052050",
      customerName: "PIEDMONT GROVETOWN",
      invoiceDate: "11/01/2024",
      IC: "I",
      invoiceNumber: "*11240037",
      type: "B",
      applyTo: "",
      trxAmt: "4,135.48",
      trxTax: "0.00",
      total: "4,135.48",
      __v: 0,
    },
    {
      _id: "676842b10ab555ed623fbe9e",
      customerId: "052044",
      customerName: "PIEDMONT SILVER BLUFF PRIMARY",
      invoiceDate: "11/01/2024",
      IC: "I",
      invoiceNumber: "*11240031",
      type: "B",
      applyTo: "",
      trxAmt: "2,499.50",
      trxTax: "0.00",
      total: "2,499.50",
      __v: 0,
    },
    {
      _id: "676842b10ab555ed623fbe80",
      customerId: "051076",
      customerName: "PLUMBERS & STEAMFITTERS",
      invoiceDate: "11/01/2024",
      IC: "I",
      invoiceNumber: "*11240021",
      type: "B",
      applyTo: "",
      trxAmt: "2,096.00",
      trxTax: "0.00",
      total: "2,096.00",
      __v: 0,
    },
    {
      _id: "676842b10ab555ed623fbec2",
      customerId: "058094",
      customerName: "POWERSERVE",
      invoiceDate: "11/01/2024",
      IC: "I",
      invoiceNumber: "*11240043",
      type: "B",
      applyTo: "",
      trxAmt: "412.40",
      trxTax: "0.00",
      total: "412.40",
      __v: 0,
    },
    {
      _id: "676842b10ab555ed623fbed1",
      customerId: "059059",
      customerName: "RING POWER CORPORATION",
      invoiceDate: "11/01/2024",
      IC: "I",
      invoiceNumber: "*11240048",
      type: "B",
      applyTo: "",
      trxAmt: "437.75",
      trxTax: "0.00",
      total: "437.75",
      __v: 0,
    },
    {
      _id: "676842b10ab555ed623fbe59",
      customerId: "009058",
      customerName: "SAIA",
      invoiceDate: "11/01/2024",
      IC: "I",
      invoiceNumber: "*11240008",
      type: "B",
      applyTo: "",
      trxAmt: "353.76",
      trxTax: "0.00",
      total: "353.76",
      __v: 0,
    },
    {
      _id: "676842b10ab555ed623fbea1",
      customerId: "052045",
      customerName: "SHARON BAPTIST CHURCH",
      invoiceDate: "11/01/2024",
      IC: "I",
      invoiceNumber: "11240032",
      type: "B",
      applyTo: "",
      trxAmt: "1,111.59",
      trxTax: "0.00",
      total: "1,111.59",
      __v: 0,
    },
    {
      _id: "676842b10ab555ed623fbe53",
      customerId: "009040",
      customerName: "SHEALY ELECTRICAL WHOLESALERS",
      invoiceDate: "11/01/2024",
      IC: "I",
      invoiceNumber: "*11240006",
      type: "B",
      applyTo: "",
      trxAmt: "732.80",
      trxTax: "0.00",
      total: "732.80",
      __v: 0,
    },
    {
      _id: "676842b10ab555ed623fbe4a",
      customerId: "009030",
      customerName: "SHINSHO AMERICAN CORP",
      invoiceDate: "11/01/2024",
      IC: "I",
      invoiceNumber: "*11240003",
      type: "B",
      applyTo: "",
      trxAmt: "415.97",
      trxTax: "0.00",
      total: "415.97",
      __v: 0,
    },
    {
      _id: "676842b10ab555ed623fbe44",
      customerId: "009023",
      customerName: "SOUTHEASTERN LAB",
      invoiceDate: "11/01/2024",
      IC: "I",
      invoiceNumber: "11240001",
      type: "B",
      applyTo: "",
      trxAmt: "246.15",
      trxTax: "0.00",
      total: "246.15",
      __v: 0,
    },
    {
      _id: "676842b10ab555ed623fbe41",
      customerId: "009017",
      customerName: "SRP FEDERAL CREDIT - EDGEFIELD",
      invoiceDate: "11/01/2024",
      IC: "I",
      invoiceNumber: "*11240000",
      type: "B",
      applyTo: "",
      trxAmt: "791.62",
      trxTax: "0.00",
      total: "791.62",
      __v: 0,
    },
    {
      _id: "676842b10ab555ed623fbee0",
      customerId: "062006",
      customerName: "SRP FEDERAL CREDIT -TOBACCO RD",
      invoiceDate: "11/01/2024",
      IC: "I",
      invoiceNumber: "*11240053",
      type: "B",
      applyTo: "",
      trxAmt: "618.48",
      trxTax: "0.00",
      total: "618.48",
      __v: 0,
    },
    {
      _id: "676842b10ab555ed623fbe8f",
      customerId: "052027",
      customerName: "ST. JOSEPH CATHOLIC CHURCH",
      invoiceDate: "11/01/2024",
      IC: "I",
      invoiceNumber: "11240026",
      type: "B",
      applyTo: "",
      trxAmt: "1,095.99",
      trxTax: "0.00",
      total: "1,095.99",
      __v: 0,
    },
  ],
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
    dataItems.customers = response.customers;
    dataItems.pagination = response.pagination;
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
    dataItems.customers = response.customers;
    dataItems.pagination = response.pagination;
  }
};
const totalInvoices = ref(0);

const uploadFile = async (e) => {
  isUploadFile.value = true;
  if (e) {
    const data = await uploadFileData(e);
    if (data?.totalInvoices) {
      totalInvoices.value = data.totalInvoices;
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
    const response = await getItems({ page: 1, limit: 50 });
    if (response) {
      dataItems.customers = response.customers;
      dataItems.pagination = response.pagination;
    }
  }
  isReset.value = false;
};
</script>
