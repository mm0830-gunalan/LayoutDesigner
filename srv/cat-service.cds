using my.bookshop as my from '../db/data-model';

service CatalogService {
    @readonly entity Books as projection on my.Books;
    entity Layout as projection on my.Layout;
     entity Control as projection on my.Control;
      entity ControlProperty as projection on my.ControlProperty;
}
