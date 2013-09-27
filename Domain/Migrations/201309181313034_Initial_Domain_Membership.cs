namespace EventFeedback.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Initial_Domain_Membership : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.webpages_Membership",
                c => new
                    {
                        UserId = c.Int(nullable: false),
                        Active = c.Boolean(),
                        CreateDate = c.DateTime(),
                        CreatedBy = c.String(maxLength: 128),
                        ModifyDate = c.DateTime(),
                        ModifiedBy = c.String(maxLength: 128),
                        Deleted = c.Boolean(),
                        DeleteDate = c.DateTime(),
                        DeletedBy = c.String(maxLength: 128),
                        ConfirmationToken = c.String(maxLength: 128),
                        IsConfirmed = c.Boolean(),
                        LastPasswordFailureDate = c.DateTime(),
                        PasswordFailuresSinceLastSuccess = c.Int(nullable: false),
                        Password = c.String(nullable: false, maxLength: 128),
                        PasswordChangedDate = c.DateTime(),
                        PasswordSalt = c.String(maxLength: 128),
                        PasswordVerificationToken = c.String(maxLength: 128),
                        PasswordVerificationTokenExpirationDate = c.DateTime(),
                    })
                .PrimaryKey(t => t.UserId);
            
            CreateTable(
                "dbo.webpages_Roles",
                c => new
                    {
                        RoleId = c.Int(nullable: false, identity: true),
                        Active = c.Boolean(),
                        CreateDate = c.DateTime(),
                        CreatedBy = c.String(maxLength: 128),
                        ModifyDate = c.DateTime(),
                        ModifiedBy = c.String(maxLength: 128),
                        Deleted = c.Boolean(),
                        DeleteDate = c.DateTime(),
                        DeletedBy = c.String(maxLength: 128),
                        RoleName = c.String(maxLength: 256),
                    })
                .PrimaryKey(t => t.RoleId);
            
            CreateTable(
                "dbo.webpages_OAuthMembership",
                c => new
                    {
                        Provider = c.String(nullable: false, maxLength: 30),
                        ProviderUserId = c.String(nullable: false, maxLength: 100),
                        UserId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.Provider, t.ProviderUserId })
                .ForeignKey("dbo.webpages_Membership", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId);
            
            CreateTable(
                "dbo.UserProfiles",
                c => new
                    {
                        UserId = c.Int(nullable: false, identity: true),
                        Active = c.Boolean(),
                        CreateDate = c.DateTime(),
                        CreatedBy = c.String(maxLength: 128),
                        ModifyDate = c.DateTime(),
                        ModifiedBy = c.String(maxLength: 128),
                        Deleted = c.Boolean(),
                        DeleteDate = c.DateTime(),
                        DeletedBy = c.String(maxLength: 128),
                        UserName = c.String(nullable: false, maxLength: 128),
                        FirstName = c.String(),
                        LastName = c.String(),
                    })
                .PrimaryKey(t => t.UserId);
            
            CreateTable(
                "dbo.webpages_UsersInRoles",
                c => new
                    {
                        UserId = c.Int(nullable: false),
                        RoleId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.UserId, t.RoleId })
                .ForeignKey("dbo.webpages_Membership", t => t.UserId, cascadeDelete: true)
                .ForeignKey("dbo.webpages_Roles", t => t.RoleId, cascadeDelete: true)
                .Index(t => t.UserId)
                .Index(t => t.RoleId);
            
            CreateTable(
                "dbo.RoleUsers",
                c => new
                    {
                        Role_Id = c.Int(nullable: false),
                        User_Id = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.Role_Id, t.User_Id })
                .ForeignKey("dbo.webpages_Roles", t => t.Role_Id, cascadeDelete: true)
                .ForeignKey("dbo.webpages_Membership", t => t.User_Id, cascadeDelete: true)
                .Index(t => t.Role_Id)
                .Index(t => t.User_Id);
            
        }
        
        public override void Down()
        {
            DropIndex("dbo.RoleUsers", new[] { "User_Id" });
            DropIndex("dbo.RoleUsers", new[] { "Role_Id" });
            DropIndex("dbo.webpages_UsersInRoles", new[] { "RoleId" });
            DropIndex("dbo.webpages_UsersInRoles", new[] { "UserId" });
            DropIndex("dbo.webpages_OAuthMembership", new[] { "UserId" });
            DropForeignKey("dbo.RoleUsers", "User_Id", "dbo.webpages_Membership");
            DropForeignKey("dbo.RoleUsers", "Role_Id", "dbo.webpages_Roles");
            DropForeignKey("dbo.webpages_UsersInRoles", "RoleId", "dbo.webpages_Roles");
            DropForeignKey("dbo.webpages_UsersInRoles", "UserId", "dbo.webpages_Membership");
            DropForeignKey("dbo.webpages_OAuthMembership", "UserId", "dbo.webpages_Membership");
            DropTable("dbo.RoleUsers");
            DropTable("dbo.webpages_UsersInRoles");
            DropTable("dbo.UserProfiles");
            DropTable("dbo.webpages_OAuthMembership");
            DropTable("dbo.webpages_Roles");
            DropTable("dbo.webpages_Membership");
        }
    }
}
