---
title: "Regularization"
date: "2024-02-20"
category: "Learning"
tags: ["Foundations"]
description: "Regularization adds a penalty to a model’s complexity, helping prevent overfitting."
source: "https://www.notion.so/1358157ad43a80dcadfdc60e19d9e84b"
---

`Regularization `is a technique that penalizes a model for being too complex. This helps prevent **`overfitting`**—where the model performs perfectly on the training data but struggles to generalize to new data. Regularization works by `adding a penalty term to the model’s loss function`, discouraging it from fitting noise in the data. This penalty term ultimately makes the model simpler and more generalizable.

## L2 Regularization

L2 regularization, also known as `Ridge Regression`, adds the sum of squared weights as a penalty term to the loss function. Mathematically, this term is represented as  ,  $\lambda\sum w_i^2$ where w are the weights of the model and λ is a hyperparameter controlling the regularization strength.

By penalizing large weights, L2 regularization pushes the model to distribute its learning across multiple features rather than relying heavily on a few.

Models with L2 regularization tend to be smoother and less sensitive to noise, resulting in better generalization.

## L1 Regularization

L1 regularization, also known as Lasso Regression, adds the sum of the absolute values of the weights as a penalty term. This term is represented as $\lambda\sum|w_i|$. 

Unlike L2, L1 regularization drives some weights exactly to zero, effectively performing feature selection.  
L1 regularization leads to **`sparser models`**` `that can be  less computationally intensive, as it excludes irrelevant features.

## Elastic Net

Elastic Net combines both L1 and L2 regularization terms. It’s useful when there are many correlated features, which may cause issues in both Ridge and Lasso alone.

$$
Elastic Net Penalty = \alpha(p_i\sum ∣wi∣+(1−ρ)_i\sum w_i^2)
$$

w are the model weights, α is the overall regularization strength, ρ controls the balance between L1 and L2 regularization terms, and

By balancing the penalties from L1 and L2, Elastic Net can handle complex data with redundancy, leading to better performance than using only one regularization type.

Elastic Net can be a good choice for datasets with high-dimensional or highly correlated features, leveraging both the sparsity of L1 and the smoothness of L2.

## Conclusion

By adding a penalty term to the loss function, regularization helps prevent overfitting and underfitting, balancing the bias-variance tradeoff. While L2 regularization encourages smoothness, L1 regularization promotes sparsity, and Elastic Net combines the strengths of both. With the right regularization, you can ensure your model performs well on new data, making it more reliable and effective.
