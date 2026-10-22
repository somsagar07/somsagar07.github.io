---
title: "Bias vs Variance"
date: "2024-02-13"
category: "Learning"
tags: ["Foundations"]
description: "This blog explains bias-variance tradeoff in machine learning model performance."
source: "https://www.notion.so/1358157ad43a80db8c9ae0959c5bc5f2"
---

`Bias and variance` are two key sources of error in machine learning models that affect their accuracy and generalization.

## Bias

- **Definition**: Bias is the error that arises when a model is too simplistic, unable to capture the underlying patterns in the data. High bias usually leads to **underfitting**.

- **Characteristics**:

    - Model assumptions are too strong, often leading to systematic errors.

    - The model makes broad generalizations and may ignore important patterns.

- **Example**: A linear regression model applied to highly nonlinear data will have high bias because it cannot capture the complexity of the data's pattern.

## Variance

- **Definition**: Variance is the error that arises when a model is too complex, fitting too closely to the training data, and becoming sensitive to noise. High variance leads to **overfitting**.

- **Characteristics**:

    - Model performs well on training data but poorly on unseen data.

    - The model captures noise and details that don’t generalize to new data.

- **Example**: A deep neural network with many layers trained on a small dataset is likely to have high variance, memorizing the data but failing to generalize.

## **The Bias-Variance Tradeoff**

- **Goal**: The aim is to find a balance where the model is neither too simple (high bias) nor too complex (high variance).

- **Tradeoff**:

    - Decreasing bias often increases variance, as more complex models can capture finer details.

    - Decreasing variance often increases bias, as simpler models generalize better but might miss details.

### **Managing Bias and Variance**

- **Choose the Right Model**: Use simpler models for simpler tasks and complex models for tasks with rich patterns.

- **Regularization**: Techniques like L2 regularization can help reduce variance by penalizing model complexity.

- **Cross-Validation**: This helps estimate model performance and find the right complexity level.

- **Feature Selection**: Limiting features reduces variance, while adding important features can reduce bias.
