import { Schema, model, models, type Model } from 'mongoose';
import { dbCollections, collectionCategories } from '../app.config';
import { onlyAlphaNumeric } from '../utils/main'
import type CollectionType from '../types/collection';

const { collections: xcollections, accounts } = dbCollections;

const CollectionSchema = new Schema<CollectionType>({
    name: {type: String, required: true, maxlength: 24, minlength: 3},
    slug: {type: String, required: true, index: true, unique: true, lowercase: true},
    description: {type: String, required: true},
    media: {type: String, required: true}, // ipfs hash
    mediaType: String,
    banner: {type: String}, // ipfs hash
    bannerType: String,
    tags: {type: String, required: true, index: true},
    category: {
        type: String, 
        required: true,
        index: true,
        enum: collectionCategories.map(c => c.slug)
    },
    externalUrl: String,
    twitter: String,
    discord: String,
    owner: {type: String, ref: accounts, required: true, index: true},
    createdAt: {type: Date},
    updatedAt: {type: Date}
}, {
    collection: xcollections,
    timestamps: true
});

CollectionSchema.pre('save', function(next) {
    // Rewrite collection slug to be only alphanumeric characters
    if(!this.slug) {
        this.slug = onlyAlphaNumeric(this.name)
    } else {
        this.slug = onlyAlphaNumeric(this.slug)
    }

    next()
})

/* CollectionSchema.post('find', function(docs: CollectionType[]) {
    docs.forEach(function(doc) {
        doc?.toObject?.({
            flattenMaps: true,
            flattenObjectIds: true,
            versionKey: false
        })
    })
}) */

export default (models[xcollections] as Model<CollectionType>) || model<CollectionType>(xcollections, CollectionSchema);