---
title: "Logistic Regression"
date: "2024-01-09"
category: "Learning"
tags: ["Classical ML"]
description: "Logistic regression is a statistical method for binary classification problems."
source: "https://www.notion.so/12a8157ad43a810e9826e5c93ed27f68"
---

In `logistic regression`, we create probabilities by applying the `sigmoid function`, which converts outputs into a probability distribution between 0 and 1. Like in linear regression, we use gradient descent to optimize the model, but here we minimize the `cross-entropy` loss instead.

> Logistic regression is based on maximizing the likelihood of observing the given data under certain assumptions. This leads to minimizing the log loss (cross-entropy) during training

## Code

```python
import numpy as np

def sigmoid(x):
	return 1/(1+np.exp(-x))

class LogisticRegression():
	def __init__(self, lr=0.001, n_iter=100):
		self.lr = lr
		self.n_iter = n_iter
		self.weights = None
		self.bias = None
	
	def fit(self, x, y):
		n_samples, n_features = x.shape
		self.weights = np.zeros(n_features)
		self.bias = 0
		
		for i in range(self.n_iter):
			lpred = np.dot(x, self.weights) + self.bias
			pred = sigmoid(lpred)
			
			dw = (1/n_samples) * np.dot(x.T, (pred - y))
			db = (1/n_samples) * np.sum(pred-y)
			
			self.weights = self.weights - self.lr*dw
			self.bias = self.bias - self.lr*db
	
	def predict(self, x):
		lpred = np.dot(x, self.weights) + self.bias
		pred = sigmoid(lpred)
		
		# Return binary predictions based on threshold
    final_pred = [1 if p >= 0.5 else 0 for p in pred]
    return final_pred
```

> **Despite the Name, It's Not "Regression" in the Usual Sense**: Logistic regression is technically a classification algorithm, not a regression algorithm. Unlike linear regression, which predicts continuous values, logistic regression predicts probabilities and assigns inputs to categories.

## Conclusion

Logistic regression transforms the outputs into probabilities, it allows us to understand the likelihood of outcomes.
