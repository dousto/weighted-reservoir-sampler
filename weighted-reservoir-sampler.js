module.exports = (function() {

    var Heap = require('heap');

    var defaultConfig = function() {
        return  {
            sampleSize: 1,
            weightFunction: function() {
                return 1;
            },
            random: Math.random
        };
    };

    var mergeConfigs = function(baseConfig, secondConfig) {
        for (var varName in baseConfig) {
            if (secondConfig.hasOwnProperty(varName)) baseConfig[varName] = secondConfig[varName];
        }

        return baseConfig;
    };

    var WeightedReservoirSampler = function(config) {
        config = config || {};
        this._config = mergeConfigs(defaultConfig(), config);
        this._sample = [];
    };

    WeightedReservoirSampler.prototype.setConfig = function(newConfig) {
        newConfig = newConfig || {};
        this._config = mergeConfigs(defaultConfig(), newConfig);

        return this;
    };

// Merges the passed in configuration with the base config
// Returns the config object if no argument passed
    WeightedReservoirSampler.prototype.config = function(newConfig) {
        // Return current config if no new config is passed
        if (!newConfig) return this._config;

        this._config = mergeConfigs(this._config, newConfig);

        return this;
    };

    var heapCmp = function(item1, item2) {
        if (item1.key < item2.key) {
            return -1;
        }
        if (item1.key > item2.key) {
            return 1;
        }
        return 0;
    };

    WeightedReservoirSampler.prototype.push = function(item) {
        item = {
            value: item,
            weight: this._config.weightFunction(item)
        };

        if (item.weight < 0 || typeof item.weight !== 'number') {
            console.warn("Invalid weight returned from weightFunction().\nItem was: " + JSON.stringify(item.value) +
                "\nweightFunction() returned: " + JSON.stringify(item.weight));
            return;
        } else if (item.weight !== 0) {
            item.key = Math.pow(this._config.random(), 1 / item.weight);

            if (this._sample.length < this._config.sampleSize) {
                Heap.push(this._sample, item, heapCmp);
            } else if (item.key > this._sample[0].key) {
                Heap.pop(this._sample, heapCmp);
                Heap.push(this._sample, item, heapCmp);
            }
        }
    };

    WeightedReservoirSampler.prototype.end = function() {
        var samples = this._sample.map(function (item) { return item.value; });

        this._sample = [];

        return samples;
    };

    return WeightedReservoirSampler;

})();

/*
var Res = require('weighted-reservoir-sampler');
var res = new Res({
    sampleSize: 9,
    weightFunction: function(item) { return (item % 2) + 1 }
});
for (var i = 0; i < 150; i++) { res.push(i) }
res.end();
*/
