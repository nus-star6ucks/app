package com.star6ucks.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.star6ucks.demo.model.Item;
import com.star6ucks.demo.service.ItemService;

@CrossOrigin
@RestController
@RequestMapping("/api")
public class ItemController {
	
	@Autowired
	private ItemService itemService;
	
	@RequestMapping("/items") 
	public List<Item> getItems() {
		return itemService.getItems(); 
	}
	
}
