---
title: "Linear Regression"
date: "2023-12-22"
category: "Learning"
tags: ["Classical ML"]
description: "Linear regression is a statistical method for predicting outcomes."
source: "https://www.notion.so/12a8157ad43a8167841aee3ec2c213b7"
---

Linear regression is used to understand the pattern in a dataset. Given a set of data points, we try to find a line, `y=ax+b`, that minimizes the error between the data points and the line. Specifically, we aim to find a line with the` least mean squared error (MSE) over all data points.`

To achieve this, we assume our line equation is y=ax+b, and we calculate the MSE. To minimize the error, **we take the derivative of the MSE with respect to the parameters a and b and set it to zero**. We use gradient descent to iteratively update these parameters to find the optimal values for the linear line.

> In regression, "linear" refers to the relationship between inputs and weights, not necessarily a straight line. Models can handle curves by including polynomial terms or transforming data, which allows for fitting more complex, non-linear patterns.
>
>   
> Even though basic linear regression might look like a simple line, we can transform input variables to model curves and more complex relationships. By including **polynomial terms** we effectively change the shape of the line that linear regression is fitting
>
> Suppose we have a simple model: y=ax+b If we add polynomial terms, like x^2 or  x^3 , the model becomes:  
>
> $$
> y = a_1x + a_2x^2 + a_3x^3 + b
> $$
>
>  Now, the model can capture curves, such as parabolas or cubic shapes.

## Code

```python
import numpy

class LinearRegression:
	def __init__(self, lr=0.001, n_iter=10000):
		self.lr = lr
		self.n_iter = n_iter
		self.weights = None
		self.bias = None
	
	def fit(self, x, y):
		n_samples, n_features = x.shape
		self.weights = np.zeros(n_features ) # initialize all weights to 0
		self.bias = 0
		
		for i in range(self.n_iter):
			y_pred = np.dot(x, self.weights) + bias
			
			dw = (1/n_samples) * np.dot(x.T, (y_pred-y))
			db = (1/n_samples) * np.sum(y_pred-y)
			
			# update weights and bias
			
			self.weights = self.weights - self.lr*dw
			self.bias = self.bias - self.lr*db
	
	def predict(self, x):
		y_pred = np.dot(x, self.weights) + self.bias
		return y_pred
```

## Conclusion

Through linear regressin we can capture trends and make informed predictions based on past observations. While linear regression has its limitations such as assuming a linear relationship and being sensitive to outliers it's a statistical tool that serves as the basis for many complex models. 
