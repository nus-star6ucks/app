package com.mtech.vmcs.util;

import java.util.Stack;

public class MementoStack<T> {

  private final Stack<T> stack = new Stack<>();

  public void push(T state) {
    stack.push(state);
  }

  public T pop() {
    return stack.pop();
  }

  public void clear() {
    stack.clear();
  }
}
