/*
 * Modal Messages
 *
 * This contains all the text for the Modal component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  search: {
    id: 'app.components.Modal.search',
    defaultMessage: 'Search',
  },
  error: {
    id: 'app.components.Modal.error',
    defaultMessage: 'Error',
  },
  close: {
    id: 'app.components.Modal.close',
    defaultMessage: 'Close',
  },
  uploadAFile: {
    id: 'app.components.Modal.uploadAFile',
    defaultMessage: 'Upload a file',
  },
  cancel: {
    id: 'app.components.Modal.cancel',
    defaultMessage: 'Cancel',
  },
  importSuccessMessage: {
    id: 'app.components.Modal.importSuccessMessage',
    defaultMessage: '{numberOfRows} row(s) is imported.',
  },
  importFailureMessage: {
    id: 'app.components.Modal.importFailureMessage',
    defaultMessage: 'Fail to import rows: {error}.',
  },
  uploadMessage: {
    id: 'app.components.Modal.uploadMessage',
    defaultMessage: 'Click or drag file to this area to upload.',
  },
});
