---
title: "Gradient Descent"
date: "2024-08-06"
category: "Learning"
tags: ["Foundations"]
description: "This blog explains the workings of gradient descent."
source: "https://www.notion.so/1368157ad43a8086a7c7dd4ff106b9a5"
---

At its core, `gradient descent` is an `iterative optimization algorithm` used to find the minimum of a function. In the context of machine learning, it is often used to **minimize the cost (or loss) function, which measures how well a model fits the data.**

> The primary goal of gradient descent is to find the set of parameters $\theta$ that minimize a given cost function $J(\theta)$. This cost function quantifies the error, loss, or energy associated with a particular set of parameters. By minimizing $J(\theta)$, we optimize the system or model represented by the parameters.

## Components of gradient descent

- `Gradient` $(\nabla J(\theta))$: Represents the direction of the steepest ascent of the function $J(\theta)$. The gradient is a vector of partial derivatives of the cost function with respect to each parameter. Moving in the opposite direction of the gradient (i.e., the negative gradient) leads us towards the minimum of the function is the Negative Gradient.

- `Learning rate` $(\alpha)$: A hyperparameter that determines the size of the steps we take towards the minimum during each iteration. It controls how much we adjust the parameters in the direction of the negative gradient.

## The Iterative Process of Gradient Descent

- Initialize Parameters: Start with an initial guess for the parameters $\theta^{(0)}$.

- Compute the Gradient: Calculate the gradient of the cost function at the current parameters $\nabla J(\theta^{t})$. 

- Update Parameters: Adjust the parameters in the direction that most reduces the cost function: $\theta^{t+1}=\theta^t-\alpha \nabla J(\theta^t)$

- Check for Convergence: Determine if the changes in the cost function or parameters are below a predefined threshold.

- Iterate: Repeat the process until the algorithm converges to a minimum.

Through iterative updates, gradient descent gradually moves the parameters towards values that minimize the cost function. This process continues until convergence, where further updates result in negligible changes to the cost function or parameters.
