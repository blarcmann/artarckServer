const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const deepPopulate = require('mongoose-deep-populate')(mongoose);
// const mongooseAlgolia = require('mongoose-algolia');

const ProductSchema = new Schema({
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    image: String,
    title: String,
    description: String,
    price: Number,
    created: {
        type: Date,
        default: Date.now
    }
}, {
        toObject: { virtuals: true },
        toJSON: { virtuals: true }
    });

ProductSchema.virtual('averageRating')
    .get(function () {
        let rating = 0;
        if (this.reviews.length == 0) {
            rating = 0;
        } else {
            this.reviews.map((review) => {
                rating += review.rating
            });
            rating = rating / this.reviews.length
        }
        return rating;
    });


ProductSchema.plugin(deepPopulate);

ProductSchema.index({ title: 'text' });
// ProductSchema.plugin(mongooseAlgolia, {
//     appId: 'M4HRMABA2K',
//     apiKey: '179c84f716ec086ae21c9ee084a5d2fd',
//     indexName: 'artarckrc',
//     selector: '_id reviews category owner image title description price created',
//     populate: {
//         path: 'owner reviews category',
//         slect: 'name rating name'
//     },
//     defaults: {
//         author: 'unknown'
//     },
//     mappings: {
//         title: function (value) {
//             return `${value}`;
//         }
//     },
//     virtuals: {
//         averageRating: function (doc) {
//             let rating = 0;
//             if (doc.reviews.length == 0) {
//                 rating = 0;
//             } else {
//                 doc.reviews.map((review) => {
//                     rating += review.rating
//                 });
//                 rating = rating / doc.reviews.length
//             }
//             return rating;
//         }
//     },
//     debug: true
// });

// Model.SyncToAlgolia();
// Model.SetAlgoliaSettings({
    //     searchableAttributes: ['title', 'owner', 'category']
    // })
let Model = mongoose.model('Product', ProductSchema);
module.exports = Model;