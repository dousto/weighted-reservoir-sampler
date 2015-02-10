# weighted-reservoir-sampler
----------

Samples random subsets from streams.

```
npm install weighted-reservoir-sampler
```

This package is an implementation of the A-ES algorithm as described in [__Weighted Random Sampling over Data Streams__](http://arxiv.org/pdf/1012.0256.pdf).

## Basic Usage
--------------

```javascript
var Res = require('weighted-reservoir-sampler');

var res = new Res({
    sampleSize: 9,
    weightFunction: function(item) { return (item % 2) + 1 }
});

for (var i = 0; i < 150; i++) { res.push(i) }
var sample = res.end();
```

## Class: WeightedReservoirSampler

### new WeightedReservoirSampler([options])

The WeightedReservoirSampler constructor takes an optional _options_ argument containing configuration options detailed in the [__Configuration__](#configuration) section.

### weightedReservoirSampler.config([options])

If options argument is present, merges the _options_ object into the configuration of this weightedReservoirSampler instance and returns the instance.

If _options_ is missing, returns the configuration object of this weightedReservoirSampler instance.

### weightedReservoirSampler.setConfig(config)

Replaces this instance's configuration object with _config_ (supplying defaults for missing options).

### weightedReservoirSampler.push(item)

Pushes an item to the sampler. This function should be called for every item in the stream you wish to sample.

### weightedReservoirSampler.push(item)

Pushes an item to this instance's sample buffer. This function should be called for every item in the stream you wish to sample.

### weightedReservoirSampler.end()

Returns the sample, and resets this instance's sample buffer for reuse. This should be called when you have pushed all items you wish to be considered in the sample.

## Configuration

The following sections document the different options that can be passed to the _config()_, and _setConfig()_ functions.

### sampleSize

The size of the random subset to be retained when pushing items to the weightedReservoirSampler.

```javascript
var weightedReservoirSampler = new WeightedReservoirSampler({
	sampleSize: 10
});
```

Default: 1

### weightFunction

A weight function which is applied to every __item__ pushed to the weightedReservoirSampler. The returned weight from this function determines how likely an item is to be selected in the sample. An item with a weight of 10 is ten times more likely to be selected than an item with a weight of 1.

Note: The weight function should return a number greater than 0, otherwise the corresponding item is ignored.

```javascript
var weightedReservoirSampler = new WeightedReservoirSampler({
	weightFunction: function(item) {
	    return item.length * item.width;
	}
});
```

Default: function() { return 1; }

### random

The function to use for random number generation. The output of this function should be a number in the range [0, 1).

```javascript
var weightedReservoirSampler = new WeightedReservoirSampler({
	random: function() {
	    var randomNumber;
	    // Code to set randomNumber
	    return randomNumber;
	}
});
```

Default: Math.random
