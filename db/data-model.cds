namespace my.bookshop;


entity Books {
  key ID    : Integer;
      title : String;
      stock : Integer;
}

// Layout Entity
// entity Credential {
//   key userName   : String;
//       password : String(255);

//       layouts    : Composition of many Layout
//                       on layouts.userName = $self.userName;
// // One-to-Many relationship with Control, based on matching layout_id
// }

entity Layout {
  key layout_id   : UUID;
      author      : String @cds.on.insert: $user;
      layout_name : String(255);
      created_at  : DateTime default CURRENT_TIMESTAMP;
      modifiedAt  : DateTime default CURRENT_TIMESTAMP;
      controls    : Composition of many Control
                      on controls.layout_id = $self.layout_id;

// One-to-Many relationship with Control, based on matching layout_id
}

// Control Entity
entity Control {
  key controlId         : String;
      layout_id         : String;
      ParentID          : String;
      isContainer       : Boolean;
      controltype       : String;
      layout            : Association to Layout
                            on layout.layout_id = $self.layout_id;
      // Many-to-One relationship with Layout, based on matching layout_id
      controlProperties : Composition of many ControlProperty
                            on controlProperties.controlID = $self.controlId;
// One-to-Many relationship with ControlProperty, based on matching controlId
};

// ControlProperty Entity
entity ControlProperty {
  key controlID     : String;
  key propertyName  : String;
      propertyValue : String;
      control       : Association to Control
                        on control.controlId = $self.controlID;
// Many-to-One relationship with Control, based on matching controlId
};
