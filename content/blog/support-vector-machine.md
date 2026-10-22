---
title: "Support Vector Machine (SVM)"
date: "2024-02-02"
category: "Learning"
tags: ["Classical ML"]
description: "Support Vector Machine maximizes separation between classes using hyperplanes."
source: "https://www.notion.so/12c8157ad43a80609856c352beb6e0e1"
---

`SVM `(Support Vector Machine) is a` classification technique`. In SVM, the goal is to find a `hyperplane that separates data points from each class`. A hyperplane is considered optimal if it maximizes the distance between the nearest data points (called `support vectors`) of each class. Therefore, we choose a hyperplane that maximizes this distance, which helps improve classification accuracy. When implementing SVM, there is generally a trade-off between minimizing classification error (loss) and maximizing the margin between classes.

> SVMs work exceptionally well with high-dimensional data (even with thousands of features). This makes them well-suited for tasks like text classification, where the number of features often exceeds the number of data points.
>
> SVM can handle non-linear data by transforming it into a higher-dimensional space using kernel functions. This "`kernel trick`" allows SVM to create complex boundaries, enabling it to classify data that isn’t linearly separable.

## Code

```python
import numpy as np

class SVM:
	def __init__(self, lr=0.001, lamda_param=0.01, n_iter=1000):
		self.lr = lr
		self.lamda_param = lamda_param
		self.n_iter = n_iter
		self.weights = None
		self.bias = None
	
	def fit(self, x, y):
		n_samples, n_features = x.shape
		
		y0 = np.where(y<=0, -1, 1)
		
		self.weights = np.zeros(n_features)
		self.bias = 0
		
		for _ in range(self.n_iter):
			for i , x_i in enumerate(x):
				con = y0[i] * (np.dot(x_i, self.weights) - self.bias) >= 1
				if con:
					self.weights -= self.lr * (2*self.lamda_param*self.weights)
				else:
					self.weights -= self.lr * (2*self.lamda_param*self.weights) - (y0[i]*x_i)
					self.bias -= self.lr * y0[i]
	
	def predict(self, x):
		apx = np.dot(x, self.weights) - self.bias
		return np.sign(apx)
```

## Conclusion

The core objective of SVM is to find a hyperplane that maximizes the margin between support vectors, representing the boundary conditions for each class. 
