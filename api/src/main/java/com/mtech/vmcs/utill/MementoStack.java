package com.mtech.vmcs.utill;

import java.util.Stack;

public class MementoStack<T> {

    Stack<T> stack = new Stack<>();

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
