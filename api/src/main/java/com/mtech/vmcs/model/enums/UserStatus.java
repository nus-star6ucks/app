package com.mtech.vmcs.model.enums;

public enum UserStatus {
  LOGIN("login"),
  LOGOUT("logout");

  private final String status;

  UserStatus(String status) {
    this.status = status;
  }

  @Override
  public String toString() {
    return status;
  }
}
