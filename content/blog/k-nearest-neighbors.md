---
title: "K-nearest neighbors (KNN)"
date: "2023-12-07"
category: "Learning"
tags: ["Classical ML"]
description: "KNN is a classification method using proximity to determine data classes."
source: "https://www.notion.so/12a8157ad43a81cf8954fa6262fa567c"
---

`K Nearest Neighbours` (KNN) is a statisitical technique used to classify a new data point by identifying which group or class it most likely belongs to, based on its proximity to other data points in the dataset.

When a new data point is introduced, KNN finds the the k nearest data points (`neighbours`) and assigns the new data point to the class that is most common amongthe neighbours.

KNN can also be used to predict a continous value for a new data point by averaging the values of its k nearest neighbours.

<figure>
  <img src="/blog/assets/images/k-nearest-neighbors-01.png" alt="A new point is classified by the nearby labeled points in a K-nearest neighbors example." width="336" loading="lazy" decoding="async">
  <figcaption>“Figure shows two classes in distinct colors with a new, unclassified point marked in red. This illustrates how KNN can classify the new point based on its proximity to nearby points.”</figcaption>
</figure>

## Code

```python
import numpy as np
from collections import Counter

class KNN:
	def __init__(self, k=3):
		self.k = k
	
	def fit(self, x, y):
		self.X_train = x
		self.Y_train = y
		
	def predict(self, x):
		predictions = [self.predict_single(i) for i in x]
		return predictions
	
	def predict_single(self, i): 
		# Calculate the distance of x from all in X_train 
		# Euclidean distance
		distances = []
		for x in self.X_train:
			d = np.sqrt(np.sum((i - x)**2)
			distances.append(d)
		
		# get closest K
		k_index = np.argsort(distances)[:self.k]
		k_labels = [self.Y_train[j] for j in k_index]
		
		# majority voting
		common_k = Counter(k_labels).most_common() # returns list of countes of all instances 
		# most_common() returns a list of tuples and each tuples has the label and the count, (label, count) 
		return common_k[0][0]	
```

> Fun Fact: When calculating distances in `KNN`, you can try skipping the square root part of the `Euclidean distance` formula. Since the `square root` function is monotonic, if one distance squared is smaller than another, the same relationship holds for their square roots. This means you’ll still find the correct nearest neighbors even without the square root!

## Conclusion

KNN is a straightforward yet effective algorithm, especially useful for smaller datasets where it's helpful to understand how decisions are made. KNN works by looking at the nearest data points to classify or predict for a new point, making it useful for both classification and regression tasks. However, KNN can be slow on large datasets because it compares each new point to all other points. It works best when data features are on a similar scale and is most effective in datasets with fewer dimensions.
