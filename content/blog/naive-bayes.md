---
title: "Naive Bayes"
date: "2024-01-25"
category: "Learning"
tags: ["Classical ML"]
description: "Naive Bayes is a simple yet effective classification algorithm."
source: "https://www.notion.so/12a8157ad43a81369fd4efdbea55ef61"
---

`Naive Bayes` is a `probabilistic classifie`r based on using` Bayes therom`. From Bayes Theoram$P(A|B) = \frac{P(B|A) \cdot P(A)}{P(B)}$, Now if we replace that with class labels(y) and features(x) we get $P(y|x) = \frac{P(x|y) \cdot P(y)}{P(x)}$, Given that the `features are mutually independent` then we split features into different feature vectores as $P(y|x) = \frac{P(x_1|y) \cdot P(x_2|y) \cdot P(x_3|y).....P(x_n|y) \cdot P(y)}{P(x)}$, Now we select the class with the highest posterior probability i.e 

Y = $argmax_yP(y|x) = argmax_yP(x_1|y) \cdot P(x_2|y) \cdot P(x_3|y).....P(x_n|y) \cdot P(y)$ ,

Since all probabilities are in range \[0,1\] the product of all these can turn out very small thus we take the log of y which turns the RHS into a summation of logs i.e

$$
Y = argmax_y log(P(x_1|y)) + log(P(x_2|y))..... log(P(x_n|y)) + log(P(y))
$$

P(y) is called prior probabillity (frequency of each class), $P(x_i|y)$ is called the class conditional probability we model this with a guassuan distribution (typical in the case of continuous features).

> Naive Bayes is remarkably resilient to irrelevant features. Since it multiplies probabilities for each feature independently, irrelevant features with a low likelihood don't significantly impact the overall product.

## Code

```python
import numpy as np

class NaiveBayes:
	def __init__(self):
		self.classes = None
		self.n_classes = 0
		self._mean = 0
		self._var = 0
		self.priors = 0
		
	def fit(self, x, y):
		n_samples, n_features = x.shape
		self.classes = np.unique(y)
		self.n_classes = len(self.classes)
		
		# mean, var and prior of each class
		self._mean = np.zeros((n_classes, n_features))
		self._var = np.zeros((n_classes, n_features))
		self.priors = np.zeros((n_classes, n_features))
		
		for i,c in enumerate(self.classes):
			x_class = x[y==c]
			self._mean[i, :] = x_class.mean(axis=0)
			self._var[i, :] = x_class.var(axis=0)
			self.priors[i] = x_class.shape[0]/float(n_samples)
	
	def predict(self, x):
		y = [self._predict(i) for i in x]
		return np.array(y)
		
	def _predict(self, x):
		posterior_list = []
		
		for i,c in enumerate(self.classes):
			prior = np.log(self.priors[i])
			posterior = np.sum(np.log(self.gaus(i, x)))
			posterior = posterior + prior
			posterior_list.append(posterior)	
		return self.classes[np.armax(posterior)]
	
	def gaus(self, i, x):
		mean = self._mean[i]
		var = self._var[i]
		a = np.exp((-(x-mean)**2) / (2*var))
		b = np.sqrt(2*np.pi*var)
		return a/b
```

## Conclusion

Naive bayes is used for classification tasks, especially when the features are simple and loosely related. Its "naive" assumption that features are independent may not hold perfectly in real-world data, but it often performs well regardless, particularly in text classification like spam detection.
