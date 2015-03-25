ಠ_ಠ = {
    collections: [], //array of JSON representation of collections
    index : {}, //name: number <n-th in ಠ_ಠ.collections>
    current : 0,
    ಠ_ಠ : function(name){
        if(name!==undefined)
            ಠ_ಠ.current = ಠ_ಠ.index[name];
        return ಠ_ಠ.current;
    }
};

c = []; //array of actual Mongo.collection
s = []; //array of schema
r = []; //array of relations

_ ={
prepare: function(arg0,arg1){
    if(typeof arg0 === "string"){
        var json = {name: arg0};
    }else if(arg0.constructor === Meteor.Collection){
        json = {name: arg0._name};
    }else{
        json = arg0;
    }
    var name = json.name,
    schema = json.schema || {},
    relations = json.relations || {},
    options = json.options || {};
    ಠ_ಠ.current = ಠ_ಠ.collections.length;
    ಠ_ಠ.index[name] = ಠ_ಠ.current;
    ಠ_ಠ.collections.push(json);
    var mongoCollection = arg1 || new Meteor.Collection(name,options);
    c.push(mongoCollection);
    s.push(schema);
    r.push(new xToManyRelations(relations,name));
    return c[ಠ_ಠ.current];
},

find: function(arg0,arg1,arg2){
    var query = makeQuery.apply(null,arguments);
    return makeButlerObject(query);
},

count: function(arg0,arg1,arg2){
    var query = makeQuery.apply(null,arguments);
    var cursor = this.find.call(this,query);
    return cursor.count(); 
},

get: function(arg0,arg1,arg2,getOne){
    var query = makeQuery.apply(undefined,[arg0,arg1,arg2]);
    var cursor = this.find.call(this,query);
    var object = cursor.fetch();
    if(getOne===true) object = object[0];
    return makeButlerObject(object,query.name);
},

getOne: function(arg0,arg1,arg2){
    var query = makeQuery.apply(null,arguments);
    query.addOption({limit: 1});
    return this.get.apply(this,[query,undefined,undefined,true]);
}
}