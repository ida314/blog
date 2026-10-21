---
title: "Vacuous Truth and Buddhism"
image: vacuous-euler.png
lightbox: true
description: "How we can use vacuous truth to examine hard Buddhist concepts."
author:
  - name: Dylan Dodds
    url: https://dylanyuma.com
date: 2026-10-19
categories: [discrete, buddhism]
draft: false # setting this to `true` will prevent your post from appearing on your listing page until you're ready!
---

![Euler diagram of a vacuously true implication. Image: [The Proofs Project](https://math.vt.edu/proofs-project.html), Department of Mathematics, Virginia Tech ([source](https://math.vt.edu/content/dam/math_vt_edu/proofs-project/website-images/tasks/Reu_vacuous.png)).](vacuous-euler.png){fig-alt="Euler diagram: a set P inside a set Q inside a universe U, with P shaded and labelled 'Empty in vacuous case'."}

# When the Set Is Empty: Vacuous Truth and Buddhism

I've recently become interested in Buddhist philosophy, particularly its teachings on attachment, suffering, and the nature of the self. Having also taken a discrete mathematics course as a computer science student, I've noticed an interesting connection: a surprising amount of Buddhist thought can be understood through the logical concept of vacuous truth.

In both cases, a seemingly difficult question can become much simpler when we examine whether the thing we're reasoning about even exists.

## Vacuous Truth in Computer Science

In discrete mathematics, a universally quantified statement has the form:

$$
\forall x \in S,\ P(x)
$$

This means that for every element in set $S$, some property $P$ holds.

But what happens if $S$ is empty?

The statement is still true! Since there are no elements in $S$, there can't be any counterexamples. This is called **vacuous truth**.

For example, "Every unicorn in my apartment is blue" is technically true if there are no unicorns in my apartment.

This idea appears in programming, too:

```python
all([])  # True
```

Python's `all()` returns `True` for an empty iterable because no element violates the condition.

What's interesting is that the truth comes entirely from the absence of objects that we are making claims about.

## Buddhism Through Vacuous Truth

### 1. Non-Self (*Anattā*)

Suppose you ask yourself, "What defines my worth? Is it my career, intelligence, or achievements?" Buddhism challenges the assumption underlying this question: that there is a permanent, independent self whose worth needs to be defined. The Buddhist concept of *anattā*, or non-self, teaches that what we call the self is not a fixed, unchanging entity.

Now imagine a set $S$ containing all permanent, independent selves. Under this Buddhist view, $S$ is empty. Statements like "Every permanent self derives its worth from career success" become vacuously true.

The important takeaway isn't that career success defines our worth. Just like the unicorns in my apartment, the statement is only true because $S$ is empty, so it doesn't actually tell us anything about career success.

### 2. Impermanence (*Anicca*)

Another central Buddhist teaching is *anicca*, or impermanence: conditioned things are subject to change. Consider the statement, "Every achievement that guarantees permanent happiness is worth pursuing." If no achievement can guarantee permanent happiness, the set of such achievements is empty, making the statement vacuously true.

Again, this doesn't mean those achievements are worth pursuing. The opposite statement, "No achievement that guarantees permanent happiness is worth pursuing," is vacuously true as well. When a statement and its opposite are both true, it's a sign that the set we're reasoning about is empty, not that we've learned something about what's in it.

## Conclusion

Of course, vacuous truth is a logical property, not a proof of Buddhist philosophy. But I find this analogy particularly useful as it frames challenging Buddhist concepts using vacuous truth, a concept that I am already familiar with. 
