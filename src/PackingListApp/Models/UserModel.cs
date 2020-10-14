﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace PackingListApp.Models
{
    public class UserModel
    {
        [Key]
        public int Id { get; set; }
        [Column(TypeName = "nvarchar(60)")]
        public string Name { get; set; }
        [Column(TypeName = "nvarchar(100)")]
        public string LastNames { get; set; }
        [Column(TypeName = "nvarchar(100)")]
        public string Address { get; set; }
        [MaxLength(10)]
        public string Description { get; set; }
        public bool IsAdmin { get; set; }
        public string AdminType { get; set; }
    }
}
