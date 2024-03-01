using my.bookshop as my from '../db/data-model';

service CatalogService@(requires: 'authenticated-user'){
    
    @readonly entity Books @(restrict:[{

        grant: ['READ', 'WRITE'], to:'Admin'
        //  where :'title=$user.id'
    }]) as projection on my.Books;
    entity Layout @(restrict:[
       {
       where: 'author = $user.id'
    }
    ])as projection on my.Layout;
     entity Control as projection on my.Control;
      entity ControlProperty as projection on my.ControlProperty;
}
