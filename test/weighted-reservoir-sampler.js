var WeightedReservoirSampler = require('../weighted-reservoir-sampler');

exports.shouldInitializeConfig = function(test) {
    test.expect(1);
    var res = new WeightedReservoirSampler();

    test.deepEqual(res.config().sampleSize, 1, "Config values were not set to defaults");
    test.done();
};

exports.shouldAcceptConfigFromConstructor = function(test) {
    test.expect(1);

    var testConfig = {
        sampleSize: 10,
        weightFunction: function() {
            return 10;
        },
        rng: function() {
            return 1;
        }
    };

    var res = new WeightedReservoirSampler(testConfig);

    test.deepEqual(res.config(), testConfig, "Config values were not set to defaults");
    test.done();
};

exports.shouldSetConfigValues = function(test) {
    test.expect(1);
    var res = new WeightedReservoirSampler();

    res.setConfig({sampleSize: 9});

    test.deepEqual(res.config().sampleSize, 9, "Setting sample size config value through setConfig() didn\'t work");
    test.done();
};

exports.shouldSetConfigValues2 = function(test) {
    test.expect(1);
    var res = new WeightedReservoirSampler();

    res.config({sampleSize: 9});

    test.deepEqual(res.config().sampleSize, 9, "Setting sample size config value through config() didn\'t work");
    test.done();
};

exports.shouldResetConfig = function(test) {
    test.expect(1);
    var res = new WeightedReservoirSampler();

    res.config({sampleSize: 9});
    res.setConfig();

    test.deepEqual(res.config().sampleSize, 1, "Resetting config did not reset sample size");
    test.done();
};

exports.shouldIgnoreWeightsLessThanZero = function(test) {
    test.expect(1);
    var res = new WeightedReservoirSampler();

    res.config({
        sampleSize: 9,
        weightFunction: function() { return -1 }
    });

    res.push(1);

    test.deepEqual(res._sample, []);
    test.done();
};

exports.shouldIgnoreWeightsWhichAreNotANumber = function(test) {
    test.expect(1);
    var res = new WeightedReservoirSampler();

    res.config({
        sampleSize: 9,
        weightFunction: function() { return "nope" }
    });

    res.push(1);

    test.deepEqual(res._sample, []);
    test.done();
};

exports.shouldIgnoreWeightsEqualToZero = function(test) {
    test.expect(1);
    var res = new WeightedReservoirSampler();

    res.config({
        sampleSize: 9,
        weightFunction: function() { return 0 }
    });

    res.push(1);

    test.deepEqual(res._sample, []);
    test.done();
};

exports.shouldOnlyKeepSampleOfSampleSize = function(test) {
    test.expect(1);
    var res = new WeightedReservoirSampler();

    res.config({
        sampleSize: 2
    });

    res.push(1);
    res.push(1);
    res.push(1);

    test.ok(res._sample.length === 2);
    test.done();
};

exports.shouldDiscardSampleWithSmallestKey = function(test) {
    test.expect(2);
    var res = new WeightedReservoirSampler();

    var i = 1;
    res.config({
        sampleSize: 2,
        rng: function() { return i++/10 }
    });

    res.push(1);
    res.push(2);
    res.push(3);

    test.equal(res._sample[0].value, 2);
    test.equal(res._sample[1].value, 3);
    test.done();
};

exports.shouldKeepAllSamplesIfSampleSizeNotReached = function(test) {
    test.expect(1);
    var res = new WeightedReservoirSampler();

    var i = 1;
    res.config({
        sampleSize: 4,
        rng: function() { return i++/10 }
    });

    res.push(1);
    res.push(2);
    res.push(3);

    test.equal(res._sample.length, 3);
    test.done();
};

exports.shouldReturnSampleValuesOnEnd = function(test) {
    test.expect(1);
    var res = new WeightedReservoirSampler();

    var i = 1;
    res.config({
        sampleSize: 4,
        rng: function() { return i++/10 }
    });

    res.push(1);
    res.push(2);
    res.push(3);

    test.deepEqual(res.end(), [1,2,3]);
    test.done();
};

exports.shouldResetSampleOnEnd = function(test) {
    test.expect(1);
    var res = new WeightedReservoirSampler();

    var i = 1;
    res.config({
        sampleSize: 4,
        rng: function() { return i++/10 }
    });

    res.push(1);
    res.push(2);
    res.push(3);
    res.end();

    test.deepEqual(res._sample, []);
    test.done();
};
