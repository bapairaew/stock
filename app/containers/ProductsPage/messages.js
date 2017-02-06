/*
 * ProductsPage Messages
 *
 * This contains all the text for the ProductsPage component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  title: {
    id: 'app.containers.ProductsPage.title',
    defaultMessage: 'Products',
  },
  productId: {
    id: 'app.containers.ProductsPage.productId',
    defaultMessage: 'Spare ID',
  },
  productName: {
    id: 'app.containers.ProductsPage.productName',
    defaultMessage: 'Spare Name',
  },
  modelName: {
    id: 'app.containers.ProductsPage.modelName',
    defaultMessage: 'Model Name',
  },
  spare: {
    id: 'app.containers.ProductsPage.spare',
    defaultMessage: 'Spare',
  },
  unsavedMessage: {
    id: 'app.components.ProductsPage.unsavedMessage',
    defaultMessage: 'You have unsaved information, are you sure you want to leave this page?',
  },
  search: {
    id: 'app.components.ProductsPage.search',
    defaultMessage: 'Search',
  },
  edit: {
    id: 'app.components.ProductsPage.edit',
    defaultMessage: 'Edit',
  },
  editingMessageTemplate: {
    id: 'app.components.ProductsPage.editingMessageTemplate',
    defaultMessage: 'You are editing {numberOfRows} rows.',
  },
  removeTheseRows: {
    id: 'app.components.ProductsPage.removeTheseRows',
    defaultMessage: 'Remove these rows',
  },
});
