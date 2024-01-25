import ParameterOptions from "../interfaces/parameter";

const ShortenerEntryParams: ParameterOptions[] = [
  {
    param: 'short_uri',
    emptyable: false,
  },
  {
    param: 'long_uri',
    emptyable: false
  },
];

export default ShortenerEntryParams;