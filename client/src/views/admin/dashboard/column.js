const columns = [
  {
    name: 'qty',
    label: 'QTY',
    options: {
      filter: false,
      sort: true,
    },
  },

  {
    name: 'category',
    label: 'CATEGORY',
    options: {
      filter: false,
      sort: true,
    },
  },
  {
    name: 'type',
    label: 'TYPE',
    options: {
      filter: false,
      sort: true,
    },
  },
  {
    name: 'payment',
    label: 'PAYMENT',
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: 'price',
    label: 'PRICE',
    options: {
      filter: true,

      sort: true,
    },
  },
  {
    name: 'total',
    label: 'TOTAL(NGN)',
    options: {
      filter: false,

      sort: false,
    },
  },
  {
    name: 'date',
    label: 'DATE',
    options: {
      filter: true,

      sort: true,
    },
  },
]
export default columns
