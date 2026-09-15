export interface Location {
  state: string;
  lgas: {
    name: string;
    areas: string[];
  }[];
}

export const locations: Location[] = [
  {
    state: 'Lagos',
    lgas: [
      {
        name: 'Lekki',
        areas: ['Lekki Phase 1', 'Ikate', 'Chevron Drive', 'Osapa London', 'Agungi', 'Ajah', 'Sangotedo', 'Abraham Adesanya', 'Ibeju Lekki']
      },
      {
        name: 'Victoria Island',
        areas: ['Victoria Island', 'Oniru', '1004 Estate']
      },
      {
        name: 'Ikoyi',
        areas: ['Ikoyi', 'Banana Island', 'Parkview', 'Old Ikoyi', 'Dolphin Estate']
      },
      {
        name: 'Ikeja',
        areas: ['Ikeja GRA', 'Alausa', 'Opebi', 'Allen Avenue', 'Toyin Street', 'Adeniyi Jones']
      },
      {
        name: 'Surulere',
        areas: ['Surulere', 'Adeniran Ogunsanya', 'Bode Thomas', 'Aguda']
      },
      {
        name: 'Yaba',
        areas: ['Yaba', 'Akoka', 'Tejuosho', 'Sabo']
      }
    ]
  },
  {
    state: 'Akwa Ibom',
    lgas: [
      {
        name: 'Uyo',
        areas: ['Shelter Afrique Estate', 'Ewet Housing Estate', 'Osongama Estate', 'Ikot Ekpene Road', 'Oron Road', 'Abak Road']
      },
      {
        name: 'Ikot Ekpene',
        areas: ['Ikot Ekpene', 'Raffia City']
      },
      {
        name: 'Eket',
        areas: ['Eket', 'Esit Eket']
      }
    ]
  },
  {
    state: 'Abuja',
    lgas: [
      {
        name: 'Maitama',
        areas: ['Maitama', 'Maitama Extension']
      },
      {
        name: 'Asokoro',
        areas: ['Asokoro', 'Asokoro Extension']
      },
      {
        name: 'Wuse',
        areas: ['Wuse 1', 'Wuse 2', 'Wuse Market']
      },
      {
        name: 'Gwarinpa',
        areas: ['Gwarinpa', 'Gwarinpa Extension']
      },
      {
        name: 'Guzape',
        areas: ['Guzape', 'Guzape District']
      },
      {
        name: 'Jahi',
        areas: ['Jahi', 'Jahi District']
      },
      {
        name: 'Katampe',
        areas: ['Katampe Main', 'Katampe Extension']
      },
      {
        name: 'Life Camp',
        areas: ['Life Camp', 'Life Camp Extension']
      }
    ]
  },
  {
    state: 'Enugu',
    lgas: [
      {
        name: 'Enugu Urban',
        areas: ['Independence Layout', 'New Haven', 'GRA', 'Trans-Ekulu', 'Uwani', 'Achara Layout']
      },
      {
        name: 'Enugu East',
        areas: ['Abakpa', 'Iva Valley', 'Coal Camp']
      }
    ]
  },
  {
    state: 'Anambra',
    lgas: [
      {
        name: 'Awka',
        areas: ['Awka Capital Territory', 'Aroma Junction', 'Ifite Awka']
      },
      {
        name: 'Onitsha',
        areas: ['Onitsha', 'Fegge', 'Bridge Head']
      },
      {
        name: 'Nnewi',
        areas: ['Nnewi', 'Umudim', 'Otolo']
      }
    ]
  },
  {
    state: 'Imo',
    lgas: [
      {
        name: 'Owerri',
        areas: ['Owerri Municipal', 'New Owerri', 'World Bank Housing Estate', 'Ikenegbu']
      }
    ]
  },
  {
    state: 'Abia',
    lgas: [
      {
        name: 'Aba',
        areas: ['Aba', 'Osisioma', 'Ariaria']
      },
      {
        name: 'Umuahia',
        areas: ['Umuahia', 'Ubakala', 'Ibeku']
      }
    ]
  },
  {
    state: 'Ebonyi',
    lgas: [
      {
        name: 'Abakaliki',
        areas: ['Abakaliki', 'Kpirikpiri', 'Azuiyiokwu']
      }
    ]
  }
];

export const propertyTypes = [
  'Detached Duplex',
  'Semi-Detached Duplex',
  'Terraced Duplex',
  'Detached Bungalow',
  'Semi-Detached Bungalow',
  'Terraced Bungalow',
  'Flat',
  'Apartment',
  'Mansion',
  'Penthouse',
  'Land',
  'Commercial Property',
  'Office Space',
  'Shop'
];

export const priceRanges = {
  sale: [
    { label: 'Under ₦50M', min: 0, max: 50000000 },
    { label: '₦50M - ₦100M', min: 50000000, max: 100000000 },
    { label: '₦100M - ₦200M', min: 100000000, max: 200000000 },
    { label: '₦200M - ₦500M', min: 200000000, max: 500000000 },
    { label: 'Above ₦500M', min: 500000000, max: Infinity }
  ],
  rent: [
    { label: 'Under ₦1M/year', min: 0, max: 1000000 },
    { label: '₦1M - ₦3M/year', min: 1000000, max: 3000000 },
    { label: '₦3M - ₦5M/year', min: 3000000, max: 5000000 },
    { label: '₦5M - ₦10M/year', min: 5000000, max: 10000000 },
    { label: 'Above ₦10M/year', min: 10000000, max: Infinity }
  ]
};
