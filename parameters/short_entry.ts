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
  {
    param: 'author',
    emptyable: true,
    defaultValue: ""
  }
];

export default ShortenerEntryParams;