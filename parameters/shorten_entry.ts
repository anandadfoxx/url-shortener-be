import ParameterOptions from "../interfaces/parameter";

const ShortenerEntryOptions: ParameterOptions[] = [
  {
    param: 'short_url',
    emptyable: false,
  },
  {
    param: 'long_url',
    emptyable: false
  },
  {
    param: 'author',
    emptyable: true,
    defaultValue: ""
  }
];