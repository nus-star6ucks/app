package com.mtech.vmcs.model.enums;

public enum MachineStatus {

    NORMAL("normal"),
    UNAVAILABLE("unavailable"),
    STUCK("stuck");

    private final String status;

    MachineStatus(String status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return status;
    }
}
