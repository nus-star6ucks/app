package com.star6ucks.api;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

@ExtendWith(SpringExtension.class)
@SpringBootTest
@AutoConfigureMockMvc
public class HeartbeatControllerAppIntegrationTest {
    @Autowired
    private MockMvc mockMvc;

    @Test
    public void whenTestAppThenEmptyResponse() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/heartbeats").accept(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().json("{\"status\":1,\"errorCode\":\"\",\"errorMsg\":\"\",\"resultBody\":[]}"));
    }
}
