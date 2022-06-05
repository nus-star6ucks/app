package com.star6ucks.api.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;

@CrossOrigin
@RestController
@RequestMapping("/api")
public class HeartbeatController {
    @GetMapping("/heartbeats")
    public Object heartbeats() {
        return Collections.emptyList();
    }
}
