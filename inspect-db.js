print("DATABASE: " + db.getName());
print("");

const collections = db.getCollectionNames().sort();

for (const c of collections) {
    const collection = db.getCollection(c);
    const count = collection.countDocuments();

    print("========================================");
    print("COLLECTION: " + c);
    print("COUNT: " + count);

    const sample = collection.findOne();

    if (sample) {
        const idFields = Object.keys(sample).filter(k =>
            /(^id$|Id$|ID$)/.test(k)
        );

        if (idFields.length > 0) {
            print("ID FIELDS: " + idFields.join(", "));

            for (const f of idFields) {
                if (typeof sample[f] === "string") {
                    print("SAMPLE " + f + ": " + sample[f]);
                }
            }
        }
    }

    print("");
}
